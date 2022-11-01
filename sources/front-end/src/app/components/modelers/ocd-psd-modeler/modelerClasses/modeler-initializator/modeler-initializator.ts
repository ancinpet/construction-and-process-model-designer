import { mxgraph } from 'mxgraph';
import { FatalError } from "../../../../../directives/utils/exceptions";
import { CellFactory } from "../cell-generator";
import { Role } from "../cell-generator";
import { OverlayFactory } from "../overlay-generator";
import { ModelerConstants } from '../defines-constants';
import { ContractLoader } from '../contract-loader';
import { EventManager } from '../event-manager';
import { PortFactory } from '../port-generator';
import { SynchronizationManager as Sync } from '../synchronization-manager';
import { CellResizer } from '../cell-resizer';
import { OCDCommunicationService } from 'src/app/services/ocd-communication/ocd-communication.service';
import { StateManagerService } from 'src/app/services/state-management/state-manager.service';
import * as Mdl from 'src/app/model';
import { Subscription } from 'rxjs';

const mx = require('mxgraph')({
    mxImageBasePath: '/assets/mxgraph/images',
    mxBasePath: '/assets/mxgraph'
});

export class Modeler {
    private _cellFactory: CellFactory;
    private _contractLoader: ContractLoader;
    private _overlayFactory: OverlayFactory;
    private _portFactory: PortFactory;
    private _eventManager: EventManager;
    private _cellResizer: CellResizer;
    private _interactionManager: OCDCommunicationService;
    private _stateManager: StateManagerService;
    private _stateManagerSubscription: Subscription;
    private _editor: mxgraph.mxEditor;
    private _layout: mxgraph.mxCompactTreeLayout;
    private _parent: mxgraph.mxCell;
    private _ocdRoot: mxgraph.mxCell;
    private _undoManager: mxgraph.mxUndoManager;

    private _rubberbandSelection: mxgraph.mxRubberband;
    public _cellTracker: mxgraph.mxCellTracker;

    constructor(container: HTMLElement, stateManager: StateManagerService, interactionManager: OCDCommunicationService) {
        this._stateManager = stateManager;
        this._interactionManager = interactionManager;
        Sync.modeler = this;
        if (!mx.mxClient.isBrowserSupported()) {
            container.innerHTML = "Browser is not supported. Please make sure you are using up to date browser.";
            throw new FatalError("Browser is not supported.");
        }
        this._cellFactory = new CellFactory(this.createXmlDocument());
        this._contractLoader = new ContractLoader(this);
        this._overlayFactory = new OverlayFactory(this);
        this._eventManager = new EventManager(this);
        this._portFactory = new PortFactory(this);
        this._cellResizer = new CellResizer(this);

        this._editor = new mx.mxEditor();
        this._editor.setGraphContainer(container);
        this._parent = this.graph.getDefaultParent();
        this._undoManager = new mx.mxUndoManager();

        this.graph.isCellSelectable = (cell: mxgraph.mxCell): boolean => {
            var state = this.graph.view.getState(cell);
            var style = (state != null) ? state.style : this.graph.getCellStyle(cell);

            return this.graph.isCellsSelectable() && !this.graph.isCellLocked(cell) && style["selectable"] != 0;
        };

        // Allows drag selection of multiple elements
        this._rubberbandSelection = new mx.mxRubberband(this.graph);
        // Custom function to ignore edge that goes from process box to root element when it comes to highlighting
        let trackerSelector = function(me) {
            let cell = me.getCell();
            if (cell && cell.edge && !cell.value) {
                return null;
            }
            if (!cell || !cell.value || cell.value.tagName == "childLabel" ||
                cell.value == "waitLinkNode" || cell.value == "waitLinkNodeDown") {
                return null;
            }

            if (cell && cell.value && cell.value.tagName == ModelerConstants.ACTOR_LABEL_NAME) {
                return cell.parent;
            }

            return cell;
        };
        // Adds highlight when hovering over cell
        this._cellTracker = new mx.mxCellTracker(this.graph, ModelerConstants.STYLE_MOUSEOVER_HIGHLIGHT, trackerSelector);

        this._layout = new mx.mxCompactTreeLayout(this.graph);
    }

    public customizeModeler(): void {
        mx.mxEdgeHandler.prototype.snapToTerminals = true;
        // Disables default browser right click menu
        mx.mxEvent.disableContextMenu(this.graph.container);
        // Makes drag selection fade out overtime rather than instantly
        (<any>this._rubberbandSelection).fadeOut = true;
        this.graph.setAllowDanglingEdges(false);
        this.graph.setDisconnectOnMove(false);
        this.graph.setCellsDisconnectable(false);
        this.graph.setCellsResizable(false);
        this.graph.setCellsCloneable(false);
        this.setLayoutProperities();
        this.graph.setHtmlLabels(true);
        this.graph.setConnectable(true);
        this.graph.setMultigraph(false);
        this.graph.setConnectableEdges(false);
        this.graph.setDisconnectOnMove(false);
        this.graph.foldingEnabled = false;
        this.graph.setEdgeLabelsMovable(false);
        this.graph.setPanning(true);
        this.graph.tooltipHandler.setEnabled(false);
        this.graph.pageBreaksVisible = true;
        this.graph.pageBreakDashed = false;
        this.graph.preferPageSize = true;
        this.graph.pageBreakColor = "#888888";

        //Edge default style making them solid lines with no direction and also x,y coords of entry and exit
        let edgeStylesheet = this.graph.getStylesheet().getDefaultEdgeStyle();
        edgeStylesheet[mx.mxConstants.STYLE_EDGE] = mx.mxConstants.EDGESTYLE_ORTHOGONAL;
        edgeStylesheet[mx.mxConstants.STYLE_ROUNDED] = 0;
        edgeStylesheet[mx.mxConstants.STYLE_ENTRY_X] = 0;
        edgeStylesheet[mx.mxConstants.STYLE_ENTRY_Y] = 0.5;
        edgeStylesheet[mx.mxConstants.STYLE_ENTRY_PERIMETER] = 0;
        edgeStylesheet[mx.mxConstants.STYLE_EXIT_X] = 1;
        edgeStylesheet[mx.mxConstants.STYLE_EXIT_Y] = 0.5;
        edgeStylesheet[mx.mxConstants.STYLE_EXIT_PERIMETER] = 0;
        edgeStylesheet[mx.mxConstants.STYLE_JETTY_SIZE] = "auto";
        edgeStylesheet[mx.mxConstants.STYLE_MOVABLE] = 0;
        edgeStylesheet[mx.mxConstants.STYLE_EDITABLE] = 0;
        edgeStylesheet[mx.mxConstants.STYLE_BENDABLE] = 0;
        edgeStylesheet[mx.mxConstants.STYLE_ROTATABLE] = 0;
        edgeStylesheet[mx.mxConstants.STYLE_STARTARROW] = mx.mxConstants.NONE;
        edgeStylesheet[mx.mxConstants.STYLE_ENDARROW] = mx.mxConstants.NONE;
        edgeStylesheet[mx.mxConstants.STYLE_STROKECOLOR] = "#000000";

        // Color when vertex or edge is selected
        mx.mxConstants.VERTEX_SELECTION_COLOR = ModelerConstants.STYLE_SELECTED_HIGHLIGHT;
        mx.mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;
        mx.mxConstants.VERTEX_SELECTION_DASHED = 1;
        mx.mxConstants.EDGE_SELECTION_COLOR = ModelerConstants.STYLE_SELECTED_HIGHLIGHT;
        mx.mxConstants.EDGE_SELECTION_STROKEWIDTH = 2;
        mx.mxConstants.EDGE_SELECTION_DASHED = 1;
    }

    public addCellOverlay(): void {
        this.overlayFactory.registerOverlay();
    }

    public manageEvents(): void {
        // Install undo/redo manager
        let listener = (sender, evt) => {
            this.undoManager.undoableEditHappened(evt.getProperty("edit"));
        };
        this.graph.getModel().addListener(mx.mxEvent.UNDO, listener);
        this.graph.getView().addListener(mx.mxEvent.UNDO, listener);

        this.eventManager.overwriteMxgraphEvents();
        this.eventManager.setupDynamicToolbar();
        this.eventManager.setupKeypressEvents();
        this.eventManager.subscribeToMaterialDesign();
    }

    public setupPorts(): void {
        this.portFactory.overwriteMxgraphConnections();
    }

    public createNewModel(): void {
        this._ocdRoot = this.graph.insertVertex(this.parent, null, "OCDROOT", 20, 20, 0, 0, "selectable=0;");
        this.layout.execute(this.parent);
        this.undoManager.clear();
        this.graph.center(true, true, 0.05, 0.1);
        this._stateManagerSubscription = this.stateManager.getPsiContract$().subscribe((psiContract => this._contractLoader.load(psiContract)));
    }

    public insertRoleToGraph(role: Role, vertexStyle: string = ""): mxgraph.mxCell {
        let cell: mxgraph.mxCell;
        this.graph.getModel().beginUpdate();
        try {
            cell = this.graph.insertVertex(this.parent, null, role.node, 20, 0,
                role.width, role.height, role.style + vertexStyle);
            let [x, y] = role.textOffset();
            cell.geometry.offset = new mx.mxPoint(x, y);
        } finally {
            this.graph.getModel().endUpdate();
            this.cellResizer.updateCellSizesRecursively(cell);
            this.graph.getSelectionModel().clear();
        }

        return cell;
    }

    public insertRoleToGraphWithEdge(role: Role, sourceVertex: mxgraph.mxCell, edgeStyle: string = "", transactorData?: Mdl.ElementaryTransactor): mxgraph.mxCell {
        let cell: mxgraph.mxCell;
        this.model.beginUpdate();
        try {
            cell = this.graph.insertVertex(this.parent, null, role.node, 20, 0,
                role.width, role.height, role.style);
            let [x, y] = role.textOffset();
            cell.geometry.offset = new mx.mxPoint(x, y);
            let node: any = "";
            if (sourceVertex.value.tagName != ModelerConstants.PROCESS_NAME && sourceVertex.value != "OCDROOT") {
                if (sourceVertex.value.tagName == ModelerConstants.ACTOR_ROLE_NAME) {
                    node = this.cellFactory.getDefaultActorEdgeNode(transactorData);
                } else {
                    node = this.cellFactory.getDefaultEdgeNode(transactorData);
                }
            }
            let edge = this.graph.insertEdge(this.parent, null, node, sourceVertex, cell, ModelerConstants.STYLE_EDGE_DEFAULT + edgeStyle);
            // To understand how label position works, read chapter Edge Labels from https://jgraph.github.io/mxgraph/docs/js-api/files/model/mxGeometry-js.html
            edge.geometry.relative = true;
            edge.geometry.x = -1;
            edge.geometry.y = 0;
            edge.geometry.offset = new mx.mxPoint(20, 0);

            if (role.node.tagName != ModelerConstants.PROCESS_NAME && role.node.tagName != ModelerConstants.ACTOR_ROLE_NAME) {
                //ORDER DEPENDS!
                this.portFactory.addPortsToVertex(cell);
                this.portFactory.addActorLabel(cell);
            }
        } finally {
            this.model.endUpdate();
            this.cellResizer.updateCellSizesRecursively(cell);
            this.graph.getSelectionModel().clear();
        }

        return cell;
    }

    public removeCellsFromModel(cells: Array<mxgraph.mxCell>): void {
        for (let cell of cells) {
            let cellType = cell.value.tagName;
            switch (cellType) {
                case ModelerConstants.PROCESS_NAME:
                    Sync.sendRemoveProcess(cell.value.getAttribute("guid"));
                    break;
                case ModelerConstants.ACTOR_ROLE_NAME:
                    Sync.sendRemoveTransactor(cell.value.getAttribute("guid"));
                    break;
                case ModelerConstants.ELEMENTARY_ROLE_NAME:
                    Sync.sendRemoveTransactor(cell.value.getAttribute("guid"));
                    break;
                case ModelerConstants.SELF_ACTIVATING_ROLE_NAME:
                    Sync.sendRemoveTransactor(cell.value.getAttribute("guid"));
                    break;
                case ModelerConstants.CONSTARINT_LINK_NAME:
                    Sync.sendRemoveLink(cell.value.getAttribute("guid"));
                    break;
                default:
                    // Do nothing
                    break;
            }
        }
    }

    public removeCellsFromGraph(cells: Array<mxgraph.mxCell>): void {
        this.model.beginUpdate();
        try {
            let updatedCells = cells.filter(cell => {
                return !cell.isEdge() && this.cellResizer.getParent(cell) && cell.value && cell.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME;
            });
            let updatedParents = Array<mxgraph.mxCell>();
            for (let cell of updatedCells) {
                updatedParents.push(this.cellResizer.getParent(cell));
            }
            this.graph.removeCells(cells);
            this.model.endUpdate();
            for (let cell of updatedParents) {
                this.cellResizer.updateParentSizesRecursively(cell);
            }
        } finally {
            this.layout.execute(this.parent);
        }
    }

    public redrawCell(cell: mxgraph.mxCell): void {
        this.graph.view.clear(cell, false, false);
        this.graph.view.validate();
    }

    public setCellVisibility(cell: mxgraph.mxCell, visible: boolean): void {
        cell.setVisible(visible);
        this.redrawCell(cell);
    }

    public updateAllCellSizes(): void {
        let cells = this.graph.getChildVertices(this.parent);
        if (cells) {
            for (let cell of cells) {
                if (cell.value && (cell.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME || cell.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME ||
                    cell.value.tagName == ModelerConstants.ACTOR_ROLE_NAME) && cell.edges) {
                    this.cellResizer.updateParentSizesRecursively(cell);
                }
            }
        }
        this.layout.execute(this.parent);
    }

    get editor(): mxgraph.mxEditor {
        return this._editor;
    }

    get graph(): mxgraph.mxGraph {
        return (<any>this.editor).graph;
    }

    get model(): mxgraph.mxGraphModel {
        return this.graph.model;
    }

    get parent(): mxgraph.mxCell {
        return this._parent;
    }

    get layout(): mxgraph.mxCompactTreeLayout {
        return this._layout;
    }

    get ocdRoot(): mxgraph.mxCell {
        return this._ocdRoot;
    }

    get cellFactory(): CellFactory {
        return this._cellFactory;
    }

    get overlayFactory(): OverlayFactory {
        return this._overlayFactory;
    }

    get portFactory(): PortFactory {
        return this._portFactory;
    }

    get undoManager(): mxgraph.mxUndoManager {
        return this._undoManager;
    }

    get eventManager(): EventManager {
        return this._eventManager;
    }

    get interactionManager(): OCDCommunicationService {
        return this._interactionManager;
    }

    get stateManager(): StateManagerService {
        return this._stateManager;
    }

    get cellResizer(): CellResizer {
        return this._cellResizer;
    }

    get contractLoader(): ContractLoader {
        return this._contractLoader;
    }

    public createXmlDocument(): XMLDocument {
        return mx.mxUtils.createXmlDocument();
    }

    private setLayoutProperities(): void {
        let layout = <any>this._layout;

        layout.levelDistance = ModelerConstants.DISTANCE_NODE_Y;	                      
        layout.nodeDistance = ModelerConstants.DISTANCE_NODE_X;	    
        let alternateLevelDistance = ModelerConstants.DISTANCE_NODE_X_ALT;

        // Overwrite attachParent so that the edges FROM ProcessBox are shorter than others
        layout.attachParent = function(node, height) {
            let x = this.nodeDistance + this.levelDistance;
            if (node && node.cell && node.cell.value && (node.cell.value.tagName == ModelerConstants.PROCESS_NAME) || node.cell.value == "OCDROOT") {
                x = this.nodeDistance + alternateLevelDistance;
            }
            let y2 = (height - node.width) / 2 - this.nodeDistance;
            let y1 = y2 + node.width + 2 * this.nodeDistance - height;
            
            node.child.offsetX = x + node.height;
            node.child.offsetY = y1;
            
            node.contour.upperHead = this.createLine(node.height, 0,
                this.createLine(x, y1, node.contour.upperHead));
            node.contour.lowerHead = this.createLine(node.height, 0,
                this.createLine(x, y2, node.contour.lowerHead));
        };



        layout.horizontal = true;	  //Specifies the orientation of the layout.
        layout.invert = false;	    //Specifies if edge directions should be inverted.
        //layout.resizeParent = true;	//If the parents should be resized to match the width/height of the children.
        //layout.groupPadding = ;	    //Padding added to resized parents.
        //layout.parentsChanged=	    //A set of the parents that need updating based on children process as part of the layout.

        /* IMPORTANT: FIXES POSITION */
        layout.moveTree = true;	    //Specifies if the tree should be moved to the top, left corner if it is inside a top-level layer.

        /* IMPORTANT: MAKES SURE THE SUBTREE REMOVES PROPERLY */
        layout.resetEdges = false;	    //Specifies if all edge points of traversed edges should be removed.

        layout.prefHozEdgeSep = 25;   //The preferred horizontal distance between edges exiting a vertex.
        layout.prefVertEdgeOff = 24;	//The preferred vertical offset between edges exiting a vertex.
        layout.minEdgeJetty = 18;	    //The minimum distance for an edge jetty from a vertex.
        layout.channelBuffer = 4;	    //The size of the vertical buffer in the center of inter-rank channels where edge control points should not be placed.
        layout.edgeRouting = false;  	//Whether or not to apply the internal tree edge routing.
        layout.sortEdges = false;	    //Specifies if edges should be sorted according to the order of their opposite terminal cell in the model.

        // Creates top padding
        let lastY = Infinity;
        let oldLayoutApply = layout.horizontalLayout;
        layout.horizontalLayout = function(node, x0, y0, bounds) {
            let res = oldLayoutApply.call(this, node, x0, y0, bounds);
            if (lastY != res.y) {
                res.y -= ModelerConstants.DISTANCE_PADDING_TOP;
                lastY = res.y;
            }
            return res;
        }
        
    }

    public destroy(): void {
        this._stateManagerSubscription.unsubscribe();
        this.eventManager.destroy();
        this.graph.destroy();
        this._editor.destroy();
    }
}
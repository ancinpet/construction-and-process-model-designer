import { mxgraph } from 'mxgraph';
import { Modeler } from "../modeler-initializator";
import { ModelerConstants } from "../defines-constants";
import { SynchronizationManager as Sync } from '../synchronization-manager';
import { ModelParser as MdlP } from '../model-parser';
import { Subscription } from 'rxjs';
import { ModelProperties, OCDCommunicationService, PaperFormatProperties } from 'src/app/services/ocd-communication/ocd-communication.service';
import { Guid } from 'guid-typescript';
import { ActorRole, TransactionKind, ActorRoleType, TransactionSort } from 'src/app/model/model';

const mx = require('mxgraph')({
    mxImageBasePath: '/assets/mxgraph/images',
    mxBasePath: '/assets/mxgraph'
});

export class EventManager {
    private _modeler: Modeler;
    private _keyHandler: mxgraph.mxKeyHandler;
    private _eventFuncs: Array<[HTMLElement, () => void]>;
    private _propertiesSubscription: Subscription;
    private _paperSizeSubscription: Subscription;
    private _actorBindSubscription: Subscription;
    private _transactionBindSubscription: Subscription;

    constructor(modeler: Modeler) {
        this._modeler = modeler;
        this._keyHandler = null;
        this._eventFuncs = new Array<[HTMLElement, () => void]>();
        this._propertiesSubscription = null;
        this._paperSizeSubscription = null;
    }

    private changeCellTypePhaseTransactionSync(cell: mxgraph.mxCell, type: string, phase: string, transactionNumber: string): void {
        // Filters calls that don't do anything
        if ((!type || !cell.value.getAttribute("roleType") || type == cell.value.getAttribute("roleType")) && 
            (!phase || !cell.value.getAttribute("rolePhase") || phase == cell.value.getAttribute("rolePhase")) && 
            (!transactionNumber || !cell.value.getAttribute("transactionNumber") || transactionNumber == cell.value.getAttribute("transactionNumber"))) {
            return;
        }

        let vertexType: string = cell.value.tagName;
        let allVertices = this.modeler.graph.getChildVertices(this.modeler.parent);
        let actorGuid = cell.value.getAttribute("actorGuid");
        let transactionGuid = cell.value.getAttribute("transactionGuid");

        if (vertexType == ModelerConstants.ELEMENTARY_ROLE_NAME || vertexType == ModelerConstants.SELF_ACTIVATING_ROLE_NAME) {
            let boundActorVertices = allVertices.filter(cellTmp => {
                return cellTmp.value && cellTmp.value.tagName && cellTmp.value.getAttribute("actorGuid") == actorGuid;
            });
            let boundTransactionVertices = allVertices.filter(cellTmp => {
                return cellTmp.value && cellTmp.value.tagName && cellTmp.value.getAttribute("transactionGuid") == transactionGuid;
            });                

            for (let boundActor of boundActorVertices) {
                this.changeCellTypePhaseTransaction(boundActor, null, phase, null);
            }
            for (let boundTransaction of boundTransactionVertices) {
                this.changeCellTypePhaseTransaction(boundTransaction, type, null, transactionNumber);
            }
        } else if (vertexType == ModelerConstants.ACTOR_ROLE_NAME) {
            let boundActorVertices = allVertices.filter(cellTmp => {
                return cellTmp.value && cellTmp.value.tagName && cellTmp.value.getAttribute("actorGuid") == actorGuid;
            });

            for (let boundActor of boundActorVertices) {
                this.changeCellTypePhaseTransaction(boundActor, null, phase, null);
            }
        }
    }

    // Changes type and phase of selected cell, if parameter is null, then it is kept intact
    private changeCellTypePhaseTransaction(cell: mxgraph.mxCell, type: string, phase: string, transactionNumber: string): void {
        let vertexType: string = cell.value.tagName;

        if (vertexType == ModelerConstants.ELEMENTARY_ROLE_NAME || vertexType == ModelerConstants.SELF_ACTIVATING_ROLE_NAME || vertexType == ModelerConstants.ACTOR_ROLE_NAME) {
            let newStyle = "";
            if (!type) {
                type = cell.value.getAttribute("roleType");
            }
                
            if (!phase) {
                phase = cell.value.getAttribute("rolePhase");
            }

            if (!transactionNumber) {
                transactionNumber = cell.value.getAttribute("transactionNumber");
            }
                
            if (type == cell.value.getAttribute("roleType") && phase == cell.value.getAttribute("rolePhase") && transactionNumber == cell.value.getAttribute("transactionNumber")) {
                return;
            }
                
            switch (vertexType) {
                case ModelerConstants.ELEMENTARY_ROLE_NAME:
                    newStyle = this.modeler.cellFactory.createStyleElementary([type, phase], +transactionNumber);

                    let indexE = newStyle.indexOf(ModelerConstants.STYLE_IMAGE_SEARCH) + ModelerConstants.STYLE_IMAGE_SEARCH.length;
                    let svgImageE = atob(newStyle.substring(indexE).slice(0, -1));                
                    newStyle = newStyle.substring(0, indexE);

                    newStyle += btoa(this.modeler.cellResizer.updateElementaryStyle(svgImageE, cell.geometry.height, 100)) + ";";
                    break;
                case ModelerConstants.SELF_ACTIVATING_ROLE_NAME:
                    newStyle = this.modeler.cellFactory.createStyleSelfActivating([type, phase], +transactionNumber);

                    let indexS = newStyle.indexOf(ModelerConstants.STYLE_IMAGE_SEARCH) + ModelerConstants.STYLE_IMAGE_SEARCH.length;
                    let svgImageS = atob(newStyle.substring(indexS).slice(0, -1));                
                    newStyle = newStyle.substring(0, indexS);

                    newStyle += btoa(this.modeler.cellResizer.updateSelfActivatingStyle(svgImageS, cell.geometry.height, 100)) + ";";
                    break;
                case ModelerConstants.ACTOR_ROLE_NAME:
                    newStyle = this.modeler.cellFactory.createStyleActor(phase);

                    let indexA = newStyle.indexOf(ModelerConstants.STYLE_IMAGE_SEARCH) + ModelerConstants.STYLE_IMAGE_SEARCH.length;
                    let svgImageA = atob(newStyle.substring(indexA).slice(0, -1));                
                    newStyle = newStyle.substring(0, indexA);

                    newStyle += btoa(this.modeler.cellResizer.updateActorStyle(svgImageA, cell.geometry.height, 100)) + ";";
                    break;
                default:
                    return;
            }

            let newValue = cell.value.cloneNode(true);
            if (vertexType != ModelerConstants.ACTOR_ROLE_NAME) {
                newValue.setAttribute("roleType", type);
                newValue.setAttribute("transactionNumber", transactionNumber);
            }

            newValue.setAttribute("rolePhase", phase);
            this.modeler.model.beginUpdate();
            try {
                this.modeler.model.setValue(cell, newValue);
                this.modeler.model.setStyle(cell, newStyle);
            } finally {
                this.modeler.model.endUpdate();
            }
        }
    }

    // Changes link type of selected cell, if parameter is null, then it is kept intact
    private changeSelectionLinkType(type: string, actSrc: string, source: string, actTrg: string, target: string): void {
        let cells: Array<mxgraph.mxCell> = this.modeler.graph.getSelectionCells();
        if (cells.length == 1) {
            let cell = cells[0];
            let vertexType: string = cell.value.tagName;
            let targetLabel = cell.children[0];

            // Selected link is wait or inspection link
            if (vertexType == ModelerConstants.CONSTARINT_LINK_NAME && targetLabel) {                    
                if (type == cell.value.getAttribute("linkType") &&
                    actSrc == cell.value.getAttribute("linkActSource") &&
                    source == cell.value.getAttribute("linkOrientationSource") &&
                    actTrg == cell.value.getAttribute("linkActTarget") &&
                    target == cell.value.getAttribute("linkOrientationTarget")) {
                    return;
                }
                let relativeYUp = cell.value.getAttribute("relativeYUp");
                let relativeYDown = cell.value.getAttribute("relativeYDown");
                
                let newValue = cell.value.cloneNode(true);
                newValue.setAttribute("linkOrientationSource", source);
                newValue.setAttribute("linkOrientationTarget", target);
                newValue.setAttribute("linkActSource", actSrc);
                newValue.setAttribute("linkActTarget", actTrg);
                
                let newStyle = ModelerConstants.CONSTRAINT_LINK_BEGINING;
                if (source == ModelerConstants.LINK_ORIENTATION_DOWN) {
                    if (cell.source.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME) {
                        newStyle += ModelerConstants.CONSTRAINT_LINK_SOURCE_ELEMENTARY + relativeYDown + ";";
                    } else {
                        newStyle += ModelerConstants.CONSTRAINT_LINK_SOURCE_SELF_ACTIVATING + relativeYDown + ";";
                    }
                } else {
                    if (cell.source.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME) {
                        newStyle += ModelerConstants.CONSTRAINT_LINK_SOURCE_ELEMENTARY + relativeYUp + ";";
                    } else {
                        newStyle += ModelerConstants.CONSTRAINT_LINK_SOURCE_SELF_ACTIVATING + relativeYUp + ";";
                    }
                }

                let labelY = ModelerConstants.CONSTRAINT_LINK_LABEL_Y_UP;
                if (target == ModelerConstants.LINK_ORIENTATION_DOWN) {
                    labelY = ModelerConstants.CONSTRAINT_LINK_LABEL_Y_DOWN;
                    newStyle += ModelerConstants.CONSTRAINT_LINK_TARGET_DOWN;
                } else {
                    newStyle += ModelerConstants.CONSTRAINT_LINK_TARGET_UP;
                }

                let targetNode = targetLabel.value.cloneNode(true);

                // We want to change type to wait link
                if (type == ModelerConstants.LINKTYPE_WAIT) {
                    newValue.setAttribute("linkType", ModelerConstants.LINKTYPE_WAIT);
                    newValue.setAttribute("label", this.getShortcutFromAct(actTrg));
                    targetNode.setAttribute("label", this.getShortcutFromAct(actSrc));
                    newStyle += ModelerConstants.WAITLINK_STYLE;

                // We want to change type to inspection link
                } else if (type == ModelerConstants.LINKTYPE_INSPECTION) {
                    newValue.setAttribute("linkType", ModelerConstants.LINKTYPE_INSPECTION);
                    newValue.setAttribute("label", "");
                    targetNode.setAttribute("label", "");
                    newStyle += ModelerConstants.INSPECTIONLINK_STYLE;
                }

                let geo = cell.geometry.clone();
                geo.offset.y = labelY;
                geo.offset.x = ModelerConstants.CONSTRAINT_LINK_LABEL_X;

                this.modeler.model.beginUpdate();
                try {
                    this.modeler.model.setValue(cell, newValue);
                    this.modeler.model.setValue(targetLabel, targetNode);
                    this.modeler.model.setGeometry(cell, geo);
                    this.modeler.model.setStyle(cell, newStyle);
                } finally {
                    this.modeler.model.endUpdate();
                }
            }     
        }
    }

    private getShortcutFromAct(act: string, isDefaultLink: boolean = false): string {
        let res = ModelerConstants.LINK_ACT_REQUEST_S;

        switch (act) {
            case ModelerConstants.LINK_ACT_REQUEST:
                res = ModelerConstants.LINK_ACT_REQUEST_S;
                break;
            case ModelerConstants.LINK_ACT_PROMISE:
                res = ModelerConstants.LINK_ACT_PROMISE_S;
                break;
            case ModelerConstants.LINK_ACT_DECLINE:
                res = ModelerConstants.LINK_ACT_DECLINE_S;
                break;
            case ModelerConstants.LINK_ACT_QUIT:
                res = ModelerConstants.LINK_ACT_QUIT_S;
                break;
            case ModelerConstants.LINK_ACT_STATE:
                res = ModelerConstants.LINK_ACT_STATE_S;
                break;
            case ModelerConstants.LINK_ACT_ACCEPT:
                res = ModelerConstants.LINK_ACT_ACCEPT_S;
                break;
            case ModelerConstants.LINK_ACT_REJECT:
                res = ModelerConstants.LINK_ACT_REJECT_S;
                break;
            case ModelerConstants.LINK_ACT_STOP:
                res = ModelerConstants.LINK_ACT_STOP_S;
                break;
            default:
                res = ModelerConstants.LINK_ACT_REQUEST_S;
                break;
        }

        return res + (isDefaultLink ? ModelerConstants.DEFAULT_LINK_ACT_PAD : "");
    }

    // Changes link cardinality
    private changeSelectionDefaultLink(cardinalityAct: string, cardinalityFrom: string, cardinalityTo: string): void {
        let cells: Array<mxgraph.mxCell> = this.modeler.graph.getSelectionCells();
        if (cells.length == 1) {
            let cell = cells[0];
               
            let cAct = cell.value.getAttribute("cardinalityAct");
            if (cardinalityAct == cAct &&
                cardinalityFrom == cell.value.getAttribute("cardinalityFrom") &&
                cardinalityTo == cell.value.getAttribute("cardinalityTo")) {
                return;
            }

            let newValue = cell.value.cloneNode(true);

            let actPart = "\n\n" + this.getShortcutFromAct(cardinalityAct, true);
            if (cAct == "hidden") {
                actPart = "\n\n";
            } else {                
                newValue.setAttribute("cardinalityAct", cardinalityAct);
            }

            if (cardinalityFrom == "1" && cardinalityTo == "1") {
                newValue.setAttribute("label", actPart);
            } else {
                newValue.setAttribute("label", cardinalityFrom + " .. " + cardinalityTo + actPart);
            }

            newValue.setAttribute("cardinalityFrom", cardinalityFrom);
            newValue.setAttribute("cardinalityTo", cardinalityTo);

            this.modeler.model.beginUpdate();
            try {
                this.modeler.model.setValue(cell, newValue);
            } finally {
                this.modeler.model.endUpdate();
            }
        }
    }

    private addChildrenToArray(cell: mxgraph.mxCell, array: Array<mxgraph.mxCell>): void {
        if (cell.edges) {
            for (let cellEdge of cell.edges) {
                if (cellEdge.source == cell) {
                    this.addChildrenToArray(cellEdge.target, array);
                    if (!array.includes(cellEdge.target)) {
                        array.push(cellEdge.target);
                    }
                }
            }
        }
    }

    private deleteSelectedCells(): void {
        if (!this.modeler.graph.isEnabled()) {
            return;
        }
        // Get selected cells
        let selectedCells: Array<mxgraph.mxCell> = this.modeler.graph.getSelectionCells();

        // Remove regular edges (initiator link) from selection
        selectedCells = selectedCells.filter(cell => {
            return !cell.isEdge() || (cell.isEdge() && cell.value && cell.value.tagName == ModelerConstants.CONSTARINT_LINK_NAME)
        });

        if (selectedCells.length == 0) {
            return;
        }

        let cellsToRemove: Array<mxgraph.mxCell> = Array.from(selectedCells);
        for (let cell of selectedCells) {
            this.addChildrenToArray(cell, cellsToRemove);
        }
        this.modeler.removeCellsFromGraph(cellsToRemove);
        this.modeler.removeCellsFromModel(selectedCells);
    }

    public setupDynamicToolbar() {
        let func = () => {
            this.modeler.graph.zoomIn();
        };
        this._eventFuncs.push([document.getElementById("toolbar-zoom-in"), func]);
		document.getElementById("toolbar-zoom-in").addEventListener("click", func);

        func = () => {
            this.modeler.graph.zoomOut();
        };
        this._eventFuncs.push([document.getElementById("toolbar-zoom-out"), func]);
		document.getElementById("toolbar-zoom-out").addEventListener("click", func);

        func = () => {
            this.deleteSelectedCells();
        };
        this._eventFuncs.push([document.getElementById("toolbar-action-delete"), func]);
		document.getElementById("toolbar-action-delete").addEventListener("click", func);

        func = () => {
            let processBox = this.modeler.cellFactory.createProcessBox();
            let vertex = this.modeler.insertRoleToGraphWithEdge(processBox, this.modeler.ocdRoot, ModelerConstants.STYLE_EDGE_PROCESS_TO_ANY);
        };
        this._eventFuncs.push([document.getElementById("toolbar-action-process"), func]);
        document.getElementById("toolbar-action-process").addEventListener("click", func);

        func = () => {
            let scale = mx.mxUtils.getScaleForPageCount(1, this.modeler.graph, this.modeler.graph.pageFormat);
            let preview = new mx.mxPrintPreview(this.modeler.graph, scale, null, null, null, null, null, "Print CSD", false);
            let opened = preview.open().print();
        };
        this._eventFuncs.push([document.getElementById("toolbar-print"), func]);
        document.getElementById("toolbar-print").addEventListener("click", func);

        func = () => {            
            let bounds = this.modeler.graph.getGraphBounds();
            let format = new mx.mxRectangle(20, 20, bounds.width + 20, bounds.height + 20);
            let scale = mx.mxUtils.getScaleForPageCount(1, this.modeler.graph, format);
            let preview = new mx.mxPrintPreview(this.modeler.graph, scale, format, null, null, null, null, "Export OCD to SVG", false);
            
            let hrefElement = null;
            let oldRenderPage = mx.mxPrintPreview.prototype.renderPage;
            preview.renderPage = function(w, h, x, y, content, pageNumber)
            {
                let div: HTMLElement = oldRenderPage.apply(this, arguments);

                if (div.childElementCount == 1) {
                    let innerDiv: any = div.children.item(0);
                    if (innerDiv.childElementCount == 1) {
                        let data = innerDiv.children.item(0);
                        
                        var svg = data;

                        // get svg data
                        var xml = new XMLSerializer().serializeToString(svg);

                        // make it base64
                        var svg64 = btoa(xml);
                        var b64Start = 'data:image/svg+xml;base64,';
                        // prepend a "header"
                        var image64 = b64Start + svg64;

                        div.removeChild(innerDiv);

                        let ahr = document.createElement("a");
                        ahr.href = image64;
                        ahr.download = "myOCD.svg";
                        ahr.innerHTML = '<img src="' + image64 + '"></img>';

                        div.appendChild(ahr);
                        hrefElement = ahr;
                    }
                }

                return div;
            };
            
            preview.open();
            if (hrefElement) {
                hrefElement.click();
            }
        };
        this._eventFuncs.push([document.getElementById("toolbar-export"), func]);
        document.getElementById("toolbar-export").addEventListener("click", func);
    }

    public setupKeypressEvents(): void {
        this.keyHandler.bindKey(ModelerConstants.EVENT_KEY_DELETE, () => {
            this.deleteSelectedCells()});

        let graph = this.modeler.graph;
        this.modeler.graph.container.addEventListener("wheel", function(evt: WheelEvent) {
            if (evt.ctrlKey) {
                evt.preventDefault();
                if (evt.deltaY < 0) {
                    graph.zoom(1.1, false);
                } else if (evt.deltaY > 0) {
                    graph.zoom(1/1.1, false);
                }
            }
        });
    }

    private changeCellLabelFromModel(cell: mxgraph.mxCell, isActorLabel: boolean, label: string): void {
        let cellType = cell.value.tagName;
        switch (cellType) {
            case ModelerConstants.PROCESS_NAME:
                Sync.sendChangeProcess(cell.value.getAttribute("guid"), label);
                break;
            case ModelerConstants.ELEMENTARY_ROLE_NAME:
                if (isActorLabel) {
                    Sync.sendChangeActor(cell.value.getAttribute("actorGuid"), label, null);
                } else {
                    Sync.sendChangeTransaction(cell.value.getAttribute("transactionGuid"), label, null);
                }
                break;
            case ModelerConstants.SELF_ACTIVATING_ROLE_NAME:
                if (isActorLabel) {
                    Sync.sendChangeActor(cell.value.getAttribute("actorGuid"), label, null);
                } else {
                    Sync.sendChangeTransaction(cell.value.getAttribute("transactionGuid"), label, null);
                }
                break;
            case ModelerConstants.ACTOR_ROLE_NAME:
                Sync.sendChangeActor(cell.value.getAttribute("actorGuid"), label, null);
                break;
            default:
                // Do nothing
                break;
        }
    }

    public overwriteMxgraphEvents(): void {
        // Retrieves label from XML node from cell
        this.modeler.graph.convertValueToString = (cell) => {
            if (mx.mxUtils.isNode(cell.value)) {
                return cell.getAttribute('label', '');
            }
        };

        // Custom cursors
        this.modeler.graph.getCursorForCell = function(cell: mxgraph.mxCell) {
            if (cell.value && cell.value.tagName) {
                return "default";
            }

            return null;
        }

        // Updates label correctly for cells that use XML nodes
        this.modeler.graph.cellLabelChanged = (cell, newValue, autoSize) => {
            let newLabel = newValue;
            if (mx.mxUtils.isNode(cell.value)) {
                // Clones the value for correct undo/redo
                var elt = cell.value.cloneNode(true);
                elt.setAttribute("label", newValue);
                newValue = elt;
            }

            this.modeler.model.beginUpdate();
            try {
                this.modeler.model.setValue(cell, newValue);

                if (autoSize) {
                    this.modeler.graph.cellSizeUpdated(cell, false);
                }
            
                // UPDATE ALL DATA-BOUND VERTICES
                let allVertices = this.modeler.graph.getChildVertices(this.modeler.parent);
                if (cell.value) {
                    if (cell.value.tagName == ModelerConstants.ACTOR_ROLE_NAME) {
                        let boundActorVertices = allVertices.filter(cellTmp => {
                            return cellTmp.value && cellTmp.value.tagName && cellTmp != cell && cellTmp.value.getAttribute("actorGuid") == cell.value.getAttribute("actorGuid");
                        });

                        for (let boundActor of boundActorVertices) {
                            if (boundActor.value.tagName == ModelerConstants.ACTOR_ROLE_NAME) {
                                MdlP.setCellLabel(this.modeler, boundActor, newLabel);
                            } else if (boundActor.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME || boundActor.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME) {
                                MdlP.setCellLabel(this.modeler, this.getChildLabel(boundActor), newLabel);
                            }
                        }
                    } else if (cell.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME || cell.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME) {
                        let boundTransactionVertices = allVertices.filter(cellTmp => {
                            return cellTmp.value && cellTmp.value.tagName && cellTmp != cell && cellTmp.value.getAttribute("transactionGuid") == cell.value.getAttribute("transactionGuid");
                        });

                        for (let boundTransaction of boundTransactionVertices) {
                            MdlP.setCellLabel(this.modeler, boundTransaction, newLabel);
                        }
                    } else if (cell.value.tagName == ModelerConstants.ACTOR_LABEL_NAME && cell.parent.value && cell.parent.value.tagName) {
                        let boundActorVertices = allVertices.filter(cellTmp => {
                            return cellTmp.value && cellTmp.value.tagName && this.getChildLabel(cellTmp) != cell && cellTmp.value.getAttribute("actorGuid") == cell.parent.value.getAttribute("actorGuid");
                        });
                        
                        for (let boundActor of boundActorVertices) {
                            if (boundActor.value.tagName == ModelerConstants.ACTOR_ROLE_NAME) {
                                MdlP.setCellLabel(this.modeler, boundActor, newLabel);
                            } else if (boundActor.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME || boundActor.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME) {
                                MdlP.setCellLabel(this.modeler, this.getChildLabel(boundActor), newLabel);
                            }
                        }
                    }

                }
            } finally {
                this.modeler.model.endUpdate();
                if (cell.value && cell.value.tagName == ModelerConstants.ACTOR_LABEL_NAME) {
                    this.changeCellLabelFromModel(cell.parent, true, newLabel);
                } else if (cell.value && (cell.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME || cell.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME)) {
                    this.changeCellLabelFromModel(cell, false, newLabel);
                } else {
                    this.changeCellLabelFromModel(cell, true, newLabel);
                }
                this.updateAccordingToSelection(this.modeler.interactionManager);
            }
        };
    }

    private getChildLabel(cell: mxgraph.mxCell): mxgraph.mxCell {
        if (cell.children) {
            for (let child of cell.children) {
                if (child.value && child.value.tagName == ModelerConstants.ACTOR_LABEL_NAME) {
                    return child;
                }
            }
        }
        
        return null;
    }

    public subscribeToMaterialDesign(): void {
        this._propertiesSubscription = this.modeler.interactionManager.getModelProperties$().subscribe((properties: ModelProperties) => {this.resolvePropertyBarEvent(properties, this.modeler)});
        this._paperSizeSubscription = this.modeler.interactionManager.getPaperFormatHandler$().subscribe((properties: PaperFormatProperties) => {this.resolvePaperSizeChange(properties, this.modeler)});
        this._actorBindSubscription = this.modeler.interactionManager.getActorBindHandler$().subscribe((properties: ActorRole) => {this.bindActors(properties)});
        this._transactionBindSubscription = this.modeler.interactionManager.getTransactionBindHandler$().subscribe((properties: TransactionKind) => {this.bindTransactions(properties)});

        // Hide all by default
        this.hideAllOptions(this.modeler.interactionManager);

        // Update properties bar on selection change
        this.modeler.graph.getSelectionModel().addListener(mx.mxEvent.CHANGE, () => this.updateAccordingToSelection(this.modeler.interactionManager));    
    }

    private updateAccordingToSelection(interactionManager: OCDCommunicationService) {
        if (this.modeler.graph.isSelectionEmpty()) {
            this.hideAllOptions(interactionManager);
        } else {
            let cells: Array<mxgraph.mxCell> = this.modeler.graph.getSelectionCells();

            // If only one cell is selected and it has XML node as value
            if (cells.length == 1 && cells[0].value) {
                let cell = cells[0];

                // Get cell type
                let vertexType: string = cell.value.tagName;

                let actorGuid = cell.value.getAttribute("actorGuid");
                let transactionGuid = cell.value.getAttribute("transactionGuid");
                let rolePhase = cell.value.getAttribute("rolePhase");
                let roleType = cell.value.getAttribute("roleType");
                let linkType = cell.value.getAttribute("linkType");
                let linkActSource = cell.value.getAttribute("linkActSource");
                let linkSource = cell.value.getAttribute("linkOrientationSource");
                let linkActTarget = cell.value.getAttribute("linkActTarget");
                let linkTarget = cell.value.getAttribute("linkOrientationTarget");
                let cardinalityAct = cell.value.getAttribute("cardinalityAct");
                let cardinalityFrom = cell.value.getAttribute("cardinalityFrom");
                let cardinalityTo = cell.value.getAttribute("cardinalityTo");

                // Custom logic that shows the sidebar icons based on what is selected
                switch (vertexType) {
                    case ModelerConstants.PROCESS_NAME:
                        this.hideAllOptions(interactionManager);
                        break;
                    case ModelerConstants.ACTOR_ROLE_NAME: 
                        this.showRoleOptions(interactionManager, rolePhase == ModelerConstants.SOI_EXTERNAL, actorGuid);
                        break;
                    case ModelerConstants.ELEMENTARY_ROLE_NAME: 
                        this.showTransactorOptions(interactionManager, rolePhase == ModelerConstants.SOI_EXTERNAL, roleType, actorGuid, transactionGuid);
                        break;
                    case ModelerConstants.SELF_ACTIVATING_ROLE_NAME: 
                        this.showTransactorOptions(interactionManager, rolePhase == ModelerConstants.SOI_EXTERNAL, roleType, actorGuid, transactionGuid);
                        break;
                    case ModelerConstants.CONSTARINT_LINK_NAME:  
                        this.showLinkOptions(interactionManager, linkType, linkActSource, linkSource, linkActTarget, linkTarget);
                        break;
                    case ModelerConstants.LINKTYPE_DEFAULT:
                        this.showDefaultLinkOptions(interactionManager, cardinalityAct, cardinalityFrom, cardinalityTo);
                        break;
                    default: 
                        this.hideAllOptions(interactionManager);
                        break;
                }
            } else {
                this.hideAllOptions(interactionManager);
            }
        }
    }

    public hideAllOptions(interactionManager: OCDCommunicationService) {
        interactionManager.dispatchPropertyBarChange(
            {
                rolePhaseCheckboxShown: false,
                roleTypeComboboxShown: false,
                linkTypeComboboxShown: false,
                cardinalityShown: false,

                rolePhaseCheckboxChecked: false,
                selectedActorGuid: Guid.EMPTY,
                selectedTransactionGuid: Guid.EMPTY,
                roleTypeComboboxValue: ModelerConstants.ROLETYPE_ORIGINAL,
                linkTypeComboboxValue: ModelerConstants.LINKTYPE_WAIT,
                linkActValueSource: ModelerConstants.LINK_ACT_REQUEST,
                linkSourcePosition: "Top",
                linkActValueTarget: ModelerConstants.LINK_ACT_REQUEST,
                linkTargetPosition: "Top",
                cardinalityAct: ModelerConstants.LINK_ACT_PROMISE,
                cardinalityFromValue: "1",
                cardinalityToValue: "1"
            }
        );
    }

    public showRoleOptions(interactionManager: OCDCommunicationService, rolePhase: boolean, actorGuid: string) {
        interactionManager.dispatchPropertyBarChange(
            {
                rolePhaseCheckboxShown: true,
                roleTypeComboboxShown: false,
                linkTypeComboboxShown: false,
                cardinalityShown: false,

                rolePhaseCheckboxChecked: rolePhase,
                selectedActorGuid: actorGuid,
                selectedTransactionGuid: Guid.EMPTY,
                roleTypeComboboxValue: ModelerConstants.ROLETYPE_ORIGINAL,
                linkTypeComboboxValue: ModelerConstants.LINKTYPE_WAIT,
                linkActValueSource: ModelerConstants.LINK_ACT_REQUEST,
                linkSourcePosition: "Top",
                linkActValueTarget: ModelerConstants.LINK_ACT_REQUEST,
                linkTargetPosition: "Top",
                cardinalityAct: ModelerConstants.LINK_ACT_PROMISE,
                cardinalityFromValue: "1",
                cardinalityToValue: "1"
            }
        );
    }

    public showTransactorOptions(interactionManager: OCDCommunicationService, rolePhase: boolean, roleType: string, actorGuid: string, transactionGuid: string) {
        interactionManager.dispatchPropertyBarChange(
            {
                rolePhaseCheckboxShown: true,
                roleTypeComboboxShown: true,
                linkTypeComboboxShown: false,
                cardinalityShown: false,

                rolePhaseCheckboxChecked: rolePhase,
                selectedActorGuid: actorGuid,
                selectedTransactionGuid: transactionGuid,
                roleTypeComboboxValue: roleType,
                linkTypeComboboxValue: ModelerConstants.LINKTYPE_WAIT,
                linkActValueSource: ModelerConstants.LINK_ACT_REQUEST,
                linkSourcePosition: "Top",
                linkActValueTarget: ModelerConstants.LINK_ACT_REQUEST,
                linkTargetPosition: "Top",
                cardinalityAct: ModelerConstants.LINK_ACT_PROMISE,
                cardinalityFromValue: "1",
                cardinalityToValue: "1"
            }
        );
    }

    public showLinkOptions(interactionManager: OCDCommunicationService, linkType: string, linkActSource: string, linkSource: string, linkActTarget: string, linkTarget: string) {
        interactionManager.dispatchPropertyBarChange(
            {
                rolePhaseCheckboxShown: false,
                roleTypeComboboxShown: false,
                linkTypeComboboxShown: true,
                cardinalityShown: false,

                rolePhaseCheckboxChecked: false,
                selectedActorGuid: Guid.EMPTY,
                selectedTransactionGuid: Guid.EMPTY,
                roleTypeComboboxValue: ModelerConstants.ROLETYPE_ORIGINAL,
                linkTypeComboboxValue: linkType,
                linkActValueSource: linkActSource,
                linkSourcePosition: linkSource,
                linkActValueTarget: linkActTarget,
                linkTargetPosition: linkTarget,
                cardinalityAct: ModelerConstants.LINK_ACT_PROMISE,
                cardinalityFromValue: "1",
                cardinalityToValue: "1"
            }
        );
    }

    public showDefaultLinkOptions(interactionManager: OCDCommunicationService, act: string, from: string, to: string) {
        interactionManager.dispatchPropertyBarChange(
            {
                rolePhaseCheckboxShown: false,
                roleTypeComboboxShown: false,
                linkTypeComboboxShown: false,
                cardinalityShown: true,

                rolePhaseCheckboxChecked: false,
                selectedActorGuid: Guid.EMPTY,
                selectedTransactionGuid: Guid.EMPTY,
                roleTypeComboboxValue: ModelerConstants.ROLETYPE_ORIGINAL,
                linkTypeComboboxValue: ModelerConstants.LINKTYPE_WAIT,
                linkActValueSource: ModelerConstants.LINK_ACT_REQUEST,
                linkSourcePosition: "Top",
                linkActValueTarget: ModelerConstants.LINK_ACT_REQUEST,
                linkTargetPosition: "Top",
                cardinalityAct: act,
                cardinalityFromValue: from,
                cardinalityToValue: to
            }
        );
    }

    private resolvePropertyBarEvent(properties: ModelProperties, modeler: Modeler): void {
        // Get selected cells
        let selectedCells: Array<mxgraph.mxCell> = modeler.graph.getSelectionCells();
        if (selectedCells.length == 1) {
            if (selectedCells[0].isEdge()) {
                let cell = selectedCells[0];
                if (selectedCells[0].value.tagName == ModelerConstants.LINKTYPE_DEFAULT) {
                    let cAct = cell.value.getAttribute("cardinalityAct");
                    if (properties.cardinalityAct == cAct &&
                        properties.cardinalityFrom == cell.value.getAttribute("cardinalityFrom") &&
                        properties.cardinalityTo == cell.value.getAttribute("cardinalityTo")) {
                        return;
                    }
                    this.changeSelectionDefaultLink(properties.cardinalityAct, properties.cardinalityFrom, properties.cardinalityTo);
                    Sync.sendChangeTransactor(selectedCells[0].target.value.getAttribute("guid"), null, null, properties.cardinalityFrom, properties.cardinalityTo, properties.cardinalityAct);
                } else {                    
                    if (properties.linkType == cell.value.getAttribute("linkType") &&
                        properties.linkActSource == cell.value.getAttribute("linkActSource") &&
                        properties.linkSource == cell.value.getAttribute("linkOrientationSource") &&
                        properties.linkActTarget == cell.value.getAttribute("linkActTarget") &&
                        properties.linkTarget == cell.value.getAttribute("linkOrientationTarget")) {
                        return;
                    }
                    this.changeSelectionLinkType(properties.linkType, properties.linkActSource, properties.linkSource, properties.linkActTarget, properties.linkTarget);
                    let graphicalPoints = this.getPointsFromTerminals(cell.geometry.points);
                    Sync.sendChangeWaitLink(selectedCells[0].value.getAttribute("guid"), properties.linkType, properties.linkActSource, properties.linkActTarget, properties.linkSource == ModelerConstants.LINK_ORIENTATION_DOWN, properties.linkTarget == ModelerConstants.LINK_ORIENTATION_DOWN, graphicalPoints);
                }
            } else {                     
                let phase = properties.transactionPhase ? ModelerConstants.SOI_EXTERNAL : ModelerConstants.SOI_INTERNAL;
                let cells: Array<mxgraph.mxCell> = selectedCells;
                if (cells.length == 1 && cells[0].value && cells[0].value.tagName != ModelerConstants.PROCESS_NAME) {
                    let oldPhase = cells[0].value.getAttribute("rolePhase");
                    let oldType = cells[0].value.getAttribute("roleType");
                    this.changeCellTypePhaseTransactionSync(cells[0], properties.transactionType, phase, null);
                    if (phase != oldPhase) {
                        Sync.sendChangeActor(cells[0].value.getAttribute("actorGuid"), null, properties.transactionPhase ? ModelerConstants.SOI_EXTERNAL : ModelerConstants.SOI_INTERNAL);
                    } else if (properties.transactionType != oldType && cells[0].value.tagName != ModelerConstants.ACTOR_ROLE_NAME) {
                        Sync.sendChangeTransaction(cells[0].value.getAttribute("transactionGuid"), null, properties.transactionType);
                    }
                }
            }
        }
    }

    private getPointsFromTerminals(points): Array<[number, number]> {
        if (!points) {
            return new Array<[number, number]>();
        }

        let graphicalPoints = new Array<[number, number]>();
        for (let i = 0; i < points.length; ++i) {
            graphicalPoints.push([points[i].x, points[i].y]);
        }
        return graphicalPoints;
    }

    private resolvePaperSizeChange(properties: PaperFormatProperties, modeler: Modeler): void {
        modeler.graph.pageFormat = new mx.mxRectangle(0, 0, properties.width * ModelerConstants.MX_MILIMETER_PIXEL_CONSTANT, properties.height * ModelerConstants.MX_MILIMETER_PIXEL_CONSTANT);
        modeler.graph.sizeDidChange();
    }

    private bindActors(chosenActor: ActorRole) {
        let selectedCells: Array<mxgraph.mxCell> = this.modeler.graph.getSelectionCells();
        if (selectedCells.length == 1) {
            let selectedCell = selectedCells[0];
            if (selectedCell.value) {
                let selectedActorGuid = selectedCell.value.getAttribute("actorGuid");
                if (selectedActorGuid && !chosenActor.id.equals(Guid.parse(selectedActorGuid))) {
                    let cellPhase = selectedCell.value.getAttribute("rolePhase");
                    let actorPhase = this.getPhaseFromActor(chosenActor);
                    if (cellPhase != actorPhase) {
                        let cells: Array<mxgraph.mxCell> = this.modeler.graph.getSelectionCells();
                        if (cells.length == 1) {
                            this.changeCellTypePhaseTransaction(cells[0], null, actorPhase, null);
                        }
                    }
                    MdlP.setActorLabel(this.modeler, selectedCell, chosenActor.name);
                    MdlP.setActorGuid(this.modeler, selectedCell, chosenActor.id);
                    Sync.sendChangeTransactor(selectedCell.value.getAttribute("guid"), chosenActor.id.toString(), null, null, null, null);
                }
            }
        }
    }

    private bindTransactions(chosenTransaction: TransactionKind) {
        let selectedCells: Array<mxgraph.mxCell> = this.modeler.graph.getSelectionCells();
        if (selectedCells.length == 1) {
            let selectedCell = selectedCells[0];
            if (selectedCell.value) {
                let selectedTransactionGuid = selectedCell.value.getAttribute("transactionGuid");
                if (selectedTransactionGuid && !chosenTransaction.id.equals(Guid.parse(selectedTransactionGuid))) {
                    let cellType = selectedCell.value.getAttribute("roleType");
                    let cellTransactionNumber = selectedCell.value.getAttribute("transactionNumber");
                    let transactionType = this.getTypeFromTransaction(chosenTransaction);
                    let newTransactionNumber = null;
                    let newTransactionType = null;
                    if (chosenTransaction.identificationNumber != cellTransactionNumber) {
                        newTransactionNumber = chosenTransaction.identificationNumber;
                    }
                    if (cellType != transactionType) {
                        newTransactionType = transactionType;
                    }
                    let cells: Array<mxgraph.mxCell> = this.modeler.graph.getSelectionCells();
                    if (cells.length == 1) {
                        this.changeCellTypePhaseTransaction(cells[0], newTransactionType, null, newTransactionNumber);
                    }
                    MdlP.setTransactionLabel(this.modeler, selectedCell, chosenTransaction.name);
                    MdlP.setTransactionGuid(this.modeler, selectedCell, chosenTransaction.id);
                    Sync.sendChangeTransactor(selectedCell.value.getAttribute("guid"), null, chosenTransaction.id.toString(), null, null, null);
                }
            }
        }
    }

    private getPhaseFromActor(actor: ActorRole): string {
        if (actor.type == ActorRoleType.composite) {
            return ModelerConstants.SOI_EXTERNAL;
        }
        return ModelerConstants.SOI_INTERNAL;
    }

    private getTypeFromTransaction(transaction: TransactionKind): string {
        if (transaction.transactionSort == TransactionSort.documental) {
            return ModelerConstants.ROLETYPE_DOCUMENTAL;
        } else if (transaction.transactionSort == TransactionSort.informational) {
            return ModelerConstants.ROLETYPE_INFORMATIONAL;
        }
        
        return ModelerConstants.ROLETYPE_ORIGINAL;
    }

    get modeler(): Modeler {
        return this._modeler;
    }

    get keyHandler(): mxgraph.mxKeyHandler {
        if (!this._keyHandler) {
            this._keyHandler = new mx.mxKeyHandler(this.modeler.graph);
        }
        return this._keyHandler;
    }

    public destroy(): void {
        this._propertiesSubscription.unsubscribe();
        this._paperSizeSubscription.unsubscribe();
        this._actorBindSubscription.unsubscribe();
        this._transactionBindSubscription.unsubscribe();

        for (let [elem, func] of this._eventFuncs) {
            elem.removeEventListener("click", func);
        }
    }
}

import { mxgraph } from 'mxgraph';
import { Modeler } from "../modeler-initializator";
import { ModelerConstants } from "../defines-constants";
import { SynchronizationManager as Sync } from '../synchronization-manager';

const mx = require('mxgraph')({
    mxImageBasePath: '/assets/mxgraph/images',
    mxBasePath: '/assets/mxgraph'
});

export class OverlayFactory {
    private _modeler: Modeler;

    constructor(modeler: Modeler) {
        this._modeler = modeler;
    }

    public registerOverlay(): void {
        let modeler: Modeler = this.modeler;
        let graph: mxgraph.mxGraph = this.modeler.graph;
        let appendHighlight = new mx.mxCellHighlight(modeler.graph, ModelerConstants.STYLE_APPEND_ACTION_HIGHLIGHT, 2);
        let appendHighlightSpecial = new mx.mxCellHighlight(modeler.graph, ModelerConstants.STYLE_APPEND_ACTION_HIGHLIGHT, 2);

        let cellWithOverlay: mxgraph.mxCell = null;
        let hiddenCells: [mxgraph.mxCell, mxgraph.mxCell] = null;
        let draggedCell: mxgraph.mxCell = null;    
        let appendCandidate: [mxgraph.mxCell, mxgraph.mxCell] = null;
        let errorCell: mxgraph.mxCell = null;

        graph.addListener(mx.mxEvent.CELLS_MOVED, (sender: any, evt: any) => { 
            modeler.layout.execute(modeler.parent);
         });

        graph.addMouseListener({
            mouseDown: (sender: mxgraph.mxGraph, mouseEvent: mxgraph.mxMouseEvent) => {
                // This is a fix of mxGraph Focus bug (https://jgraph.github.io/mxgraph/docs/known-issues.html#4 - Focus) which makes keypress events user unfriendly
                graph.container.setAttribute('tabindex', '-1');
                graph.container.focus({preventScroll: true});
                draggedCell = mouseEvent.getCell();
            },
            mouseMove: (sender: mxgraph.mxGraph, mouseEvent: mxgraph.mxMouseEvent) => {
                let hoveredCell: mxgraph.mxCell = mouseEvent.getCell();

                if (draggedCell && draggedCell.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME && modeler.graph.getSelectionCells().length == 1) {
                    appendCandidate = this.getClosestCells(mouseEvent.getGraphX(), mouseEvent.getGraphY(), draggedCell);
                    appendHighlight.hide();
                    appendHighlightSpecial.hide();

                    if (appendCandidate && !hoveredCell) {
                        let [first, second] = appendCandidate;

                        if (this.lookUpForCell(first, draggedCell)) {
                            appendCandidate = null;                                        
                        } else {
                            appendHighlight.highlight(modeler.graph.view.getState(first));

                            if (second) {
                                let stateFirst = this.modeler.graph.view.getState(first);
                                let stateSecond = this.modeler.graph.view.getState(second);
                                let [x, y] = [Math.abs(stateFirst.getCenterX() - stateSecond.getCenterX()), Math.abs(stateFirst.getCenterY()- stateSecond.getCenterY())];
                                
                                let [xFirst, yFirst] = [Math.abs(stateFirst.getCenterX() - mouseEvent.getGraphX()), Math.abs(stateFirst.getCenterY() - mouseEvent.getGraphY())];
                                let [xSecond, ySecond] = [Math.abs(stateSecond.getCenterX() - mouseEvent.getGraphX()), Math.abs(stateSecond.getCenterY() - mouseEvent.getGraphY())];
                                
                                // If same level elements
                                if (x == 0 && yFirst < y && ySecond < y && xFirst <= stateFirst.width / 2) {
                                    appendHighlightSpecial.highlight(modeler.graph.view.getState(second));
                                } else {
                                    appendCandidate = [first, null];
                                }
                            }
                        }
                    }
                }

                if (draggedCell && errorCell) {                    
                    modeler.graph.removeCellOverlays(errorCell);
                }

                if (modeler.graph.getSelectionCells().length == 1 && hoveredCell && draggedCell && hoveredCell != draggedCell && draggedCell.value.tagName && hoveredCell.value.tagName) {
                    if ((hoveredCell.value.tagName != draggedCell.value.tagName) && !draggedCell.edge &&
                        !((hoveredCell.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME && draggedCell.value.tagName == ModelerConstants.ACTOR_ROLE_NAME) ||
                        (hoveredCell.value.tagName == ModelerConstants.ACTOR_ROLE_NAME && draggedCell.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME))) {
                        errorCell = this.addErrorOverlay(hoveredCell);      
                        appendCandidate = null;                  
                    }                    
                }

                // Only show overlay over vertices
                if (hoveredCell && !modeler.graph.isMouseDown && modeler.model.isVertex(hoveredCell)) {                    
                    if (hoveredCell.value && (hoveredCell.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME ||
                        hoveredCell.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME) && hoveredCell.getChildCount() == 3) {
                        if (hiddenCells) {
                            modeler.setCellVisibility(hiddenCells[0], false);
                            modeler.setCellVisibility(hiddenCells[1], false);
                        }

                        hiddenCells = this.getCellNodes(hoveredCell);

                        modeler.setCellVisibility(hiddenCells[0], true);
                        modeler.setCellVisibility(hiddenCells[1], true);
                    } else if (hoveredCell.value && hoveredCell.value.tagName == ModelerConstants.ACTOR_LABEL_NAME) {
                        if (hiddenCells) {
                            modeler.setCellVisibility(hiddenCells[0], false);
                            modeler.setCellVisibility(hiddenCells[1], false);
                        }

                        hiddenCells = this.getCellNodes(hoveredCell.parent);

                        modeler.setCellVisibility(hiddenCells[0], true);
                        modeler.setCellVisibility(hiddenCells[1], true);
                    } else if (hiddenCells && hoveredCell.value && hoveredCell.value != "waitLinkNode" &&
                               hoveredCell.value != "waitLinkNodeDown" && hoveredCell.value.tagName != ModelerConstants.ACTOR_LABEL_NAME) {
                        modeler.setCellVisibility(hiddenCells[0], false);
                        modeler.setCellVisibility(hiddenCells[1], false);
                    }

                    // Remove overlay from other cells, for example if they are overlapping
                    if (cellWithOverlay && cellWithOverlay != hoveredCell) {
                        modeler.graph.removeCellOverlays(cellWithOverlay);
                    }

                    cellWithOverlay = hoveredCell;
                    if (hoveredCell.value && hoveredCell.value.tagName == ModelerConstants.ACTOR_LABEL_NAME) {
                        cellWithOverlay = hoveredCell.parent;
                    }
                    let currentCellOverlays = modeler.graph.getCellOverlays(cellWithOverlay);

                    if (!currentCellOverlays) {
                        let vertexType: string = cellWithOverlay.value.tagName;

                        switch (vertexType) {
                            case ModelerConstants.PROCESS_NAME: 
                                this.addOverlayToProcessBox(cellWithOverlay);
                                break;
                            case ModelerConstants.ACTOR_ROLE_NAME: 
                                this.addOverlayToActorRole(cellWithOverlay);
                                break;
                            case ModelerConstants.ELEMENTARY_ROLE_NAME: 
                                this.addOverlayToElementaryRole(cellWithOverlay);
                                break;
                            case ModelerConstants.SELF_ACTIVATING_ROLE_NAME: 
                                this.addOverlayToSelfActivatingRole(cellWithOverlay);
                                break;
                        }                            
                    }
                } else if (cellWithOverlay) {                    
                    modeler.graph.removeCellOverlays(cellWithOverlay);
                }

                if ((!hoveredCell || !hoveredCell.vertex) && hiddenCells && !modeler.graph.isMouseDown) {   
                    modeler.setCellVisibility(hiddenCells[0], false);
                    modeler.setCellVisibility(hiddenCells[1], false);
                }
            },
            mouseUp: (sender: mxgraph.mxGraph, mouseEvent: mxgraph.mxMouseEvent) => {
                if (hiddenCells) { 
                    modeler.setCellVisibility(hiddenCells[0], false);
                    modeler.setCellVisibility(hiddenCells[1], false);
                }

                // Only works when one cell is selected
                if (modeler.graph.getSelectionCells().length == 1) {
                    // Drag & drop: swap draggedCell with targetCell
                    let targetCell = mouseEvent.getCell();
                    if (targetCell && draggedCell && targetCell != draggedCell && draggedCell.value.tagName && targetCell.value.tagName) {
                        this.cellDragged(draggedCell, targetCell);
                        this.modeler.updateAllCellSizes();
                    // Drag & drop: append draggedCell to appendCandidate
                    } else if (draggedCell && appendCandidate) {
                        if (appendCandidate[1]) {
                            this.cellAppendedBetween(draggedCell, appendCandidate);
                            this.modeler.updateAllCellSizes();
                        } else {
                            
                            this.cellAppended(draggedCell, appendCandidate[0]);
                            this.modeler.updateAllCellSizes();
                        }
                    }
                }                

                // Reset highlight for appending
                appendHighlight.hide();
                appendHighlightSpecial.hide();
                if (errorCell) {                    
                    modeler.graph.removeCellOverlays(errorCell);
                }
                errorCell = null;
                // Cell is not dragged anymore
                draggedCell = null;
                // Candidate no longer needed
                appendCandidate = null;
            }
        });
    }

    public getCellNodes(cell: mxgraph.mxCell): [mxgraph.mxCell, mxgraph.mxCell] {
        let res: [mxgraph.mxCell, mxgraph.mxCell] = [null, null];
        let index = 0;

        for (let child of cell.children) {
            if (child.value && (child.value == "waitLinkNode" || child.value == "waitLinkNodeDown")) {
                res[index++] = child;
            }
        }

        return res;
    }

    public addOverlayToActorRole(ActorRoleCell: mxgraph.mxCell): void {
        this.modeler.graph.addCellOverlay(ActorRoleCell, this.createOverlayElementary(this.modeler, ActorRoleCell));
    }

    public addOverlayToElementaryRole(ElementaryRoleCell: mxgraph.mxCell): void {
        this.modeler.graph.addCellOverlay(ElementaryRoleCell, this.createOverlayElementary(this.modeler, ElementaryRoleCell));
    }

    public addOverlayToSelfActivatingRole(selfActivatingRoleCell: mxgraph.mxCell): void {
        this.modeler.graph.addCellOverlay(selfActivatingRoleCell, this.createOverlayElementary(this.modeler, selfActivatingRoleCell));
    }

    public addErrorOverlay(cell: mxgraph.mxCell): mxgraph.mxCell {
        this.modeler.graph.addCellOverlay(cell, this.createOverlayError(this.modeler, cell));
        return cell;
    }

    public addOverlayToProcessBox(processBoxCell: mxgraph.mxCell): void {
        // Only allow one process to have one child
        if (processBoxCell.edges.length < 2) {
            this.modeler.graph.addCellOverlay(processBoxCell, this.createOverlaySelfActivating(this.modeler, processBoxCell));
            this.modeler.graph.addCellOverlay(processBoxCell, this.createOverlayActor(this.modeler, processBoxCell));
        }
    }

    public createOverlayActor(modeler: Modeler, cellWithOverlay: mxgraph.mxCell): mxgraph.mxCellOverlay {
        // Creates a new overlay with an image and a tooltip
        let overlay: mxgraph.mxCellOverlay = new mx.mxCellOverlay(new mx.mxImage(ModelerConstants.PATH_ACTOR_ROLE_OVERLAY,
            ModelerConstants.OVERLAY_ACTOR_ROLE_WIDTH, ModelerConstants.OVERLAY_ACTOR_ROLE_HEIGHT), null);
                            
        overlay.verticalAlign = mx.mxConstants.ALIGN_TOP;
        overlay.align = mx.mxConstants.ALIGN_RIGHT;
        overlay.cursor = ModelerConstants.CURSOR_PLUS;        

        // Installs a handler for clicks on the overlay							
        overlay.addListener(mx.mxEvent.CLICK, function (sender: any, evt2: any) {
            modeler.overlayFactory.overlayClicked(modeler, cellWithOverlay);
            let sourceGuid = cellWithOverlay.value.getAttribute("guid");
            let actorRole = modeler.cellFactory.createActorRole("internal", sourceGuid, true);
            let vertex = modeler.insertRoleToGraphWithEdge(actorRole, cellWithOverlay, ModelerConstants.STYLE_EDGE_PROCESS_TO_ANY);
        });

        return overlay;
    }

    public createOverlayElementary(modeler: Modeler, cellWithOverlay: mxgraph.mxCell): mxgraph.mxCellOverlay {
        // Creates a new overlay with an image and a tooltip
        let overlay: mxgraph.mxCellOverlay = new mx.mxCellOverlay(new mx.mxImage(ModelerConstants.PATH_ELEMENTARY_ROLE_OVERLAY,
            ModelerConstants.OVERLAY_ELEMENTARY_ROLE_WIDTH, ModelerConstants.OVERLAY_ELEMENTARY_ROLE_HEIGHT), null);
                            
        overlay.verticalAlign = mx.mxConstants.ALIGN_BOTTOM;
        overlay.align = mx.mxConstants.ALIGN_RIGHT;
        overlay.cursor = ModelerConstants.CURSOR_PLUS;        

        // Installs a handler for clicks on the overlay							
        overlay.addListener(mx.mxEvent.CLICK, function (sender: any, evt2: any) {
            modeler.overlayFactory.overlayClicked(modeler, cellWithOverlay);
            let sourceGuid = cellWithOverlay.value.getAttribute("guid");
            let elementaryRole = modeler.cellFactory.createElementaryRole(["original", "internal"], sourceGuid, false);
            let vertex = modeler.insertRoleToGraphWithEdge(elementaryRole, cellWithOverlay);
        });

        return overlay;
    }

    public createOverlaySelfActivating(modeler: Modeler, cellWithOverlay: mxgraph.mxCell): mxgraph.mxCellOverlay {
        // Creates a new overlay with an image and a tooltip
        let overlay: mxgraph.mxCellOverlay = new mx.mxCellOverlay(new mx.mxImage(ModelerConstants.PATH_SELF_ACTIVATING_ROLE_OVERLAY,
            ModelerConstants.OVERLAY_SELF_ACTIVATING_ROLE_WIDTH, ModelerConstants.OVERLAY_SELF_ACTIVATING_ROLE_HEIGHT), null);
                            
        overlay.verticalAlign = mx.mxConstants.ALIGN_BOTTOM;
        overlay.align = mx.mxConstants.ALIGN_RIGHT;
        overlay.cursor = ModelerConstants.CURSOR_PLUS;        

        // Installs a handler for clicks on the overlay							
        overlay.addListener(mx.mxEvent.CLICK, function (sender: any, evt2: any) {
            modeler.overlayFactory.overlayClicked(modeler, cellWithOverlay);
            let sourceGuid = cellWithOverlay.value.getAttribute("guid");
            let selfActivatingRole = modeler.cellFactory.createSelfActivatingRole(["original", "internal"], sourceGuid, true);
            let vertex = modeler.insertRoleToGraphWithEdge(selfActivatingRole, cellWithOverlay, ModelerConstants.STYLE_EDGE_PROCESS_TO_ANY);
        });

        return overlay;
    }

    public createOverlayError(modeler: Modeler, cellWithOverlay: mxgraph.mxCell): mxgraph.mxCellOverlay {
        // Creates a new overlay with an image and a tooltip
        let overlay: mxgraph.mxCellOverlay = new mx.mxCellOverlay(new mx.mxImage(ModelerConstants.PATH_ERROR_OVERLAY,
            ModelerConstants.OVERLAY_ERROR_WIDTH, ModelerConstants.OVERLAY_ERROR_HEIGHT), null);
                            
        overlay.verticalAlign = mx.mxConstants.ALIGN_TOP;
        overlay.align = mx.mxConstants.ALIGN_RIGHT;
        overlay.cursor = ModelerConstants.CURSOR_ERROR;     

        return overlay;
    }

    private overlayClicked(modeler: Modeler, cell: mxgraph.mxCell): void {
        if (cell && cell.value.tagName == ModelerConstants.PROCESS_NAME) {
            modeler.graph.removeCellOverlays(cell);
        }
    }

    private cellDragged(source: mxgraph.mxCell, target: mxgraph.mxCell): void {
        if (source.value.tagName == ModelerConstants.PROCESS_NAME && target.value.tagName == ModelerConstants.PROCESS_NAME) {
            this.processBoxReorder(source, target);
            Sync.sendSwapVertices(source.value.getAttribute("guid"), target.value.getAttribute("guid"));
        } else if ((source.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME || source.value.tagName == ModelerConstants.ACTOR_ROLE_NAME) &&
                   (target.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME || target.value.tagName == ModelerConstants.ACTOR_ROLE_NAME)) {
            this.actorOnlyReorder(source, target);
            Sync.sendSwapVertices(source.value.getAttribute("guid"), target.value.getAttribute("guid"));
        } else if (source.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME && target.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME) {
            this.transactorReorder(source, target);
            Sync.sendSwapVertices(source.value.getAttribute("guid"), target.value.getAttribute("guid"));
        }
    }

    private cellAppended(draggedCell: mxgraph.mxCell, appendTarget: mxgraph.mxCell): void {
        this.modeler.model.beginUpdate();
        try {
            let edit = new customEdgeChangeAppend(draggedCell, appendTarget, this.modeler);
            this.modeler.model.execute(edit);
        } finally {
            this.modeler.layout.execute(this.modeler.parent);
            this.modeler.model.endUpdate();
        }
        Sync.sendAppendTransactor(draggedCell.value.getAttribute("guid"), appendTarget.value.getAttribute("guid"));
    }

    private cellAppendedBetween(draggedCell: mxgraph.mxCell, appendCandidate: [mxgraph.mxCell, mxgraph.mxCell]): void {
        let parentFirst = this.findParent(appendCandidate[0]);
        let parentSecond = this.findParent(appendCandidate[1]);
        this.modeler.model.beginUpdate();
        try {
            let prevY = draggedCell.geometry.y;
            let edit1 = new customEdgeChangeAppend(draggedCell, parentFirst, this.modeler);
            this.modeler.model.execute(edit1);            
            let edit2 = new customPutCellBetweenTwo(draggedCell, appendCandidate, parentFirst, parentFirst != parentSecond, prevY, this.modeler);
            this.modeler.model.execute(edit2);            
        } finally {
            this.modeler.layout.execute(this.modeler.parent);
            this.modeler.model.endUpdate();
        }
        Sync.sendAppendTransactorAfter(draggedCell.value.getAttribute("guid"), parentFirst.value.getAttribute("guid"), appendCandidate[0].value.getAttribute("guid"), appendCandidate[1].value.getAttribute("guid"));
    }

    private processBoxReorder(source: mxgraph.mxCell, target: mxgraph.mxCell): void {
        let parentEdge = this.getCellParentEdge(source);
        let parent = parentEdge.source;
        let sourceEdgeIndex = parent.getEdgeIndex(this.getCellParentEdge(source));
        let targetEdgeIndex = parent.getEdgeIndex(this.getCellParentEdge(target));

        this.modeler.model.beginUpdate();
        try {
            this.swapEdgesSameParent(parent, sourceEdgeIndex, targetEdgeIndex);
        } finally {
            this.modeler.layout.execute(this.modeler.parent);
            this.modeler.model.endUpdate();
        }    
    }

    private actorOnlyReorder(source: mxgraph.mxCell, target: mxgraph.mxCell): void {
        let sourceParentEdge = this.getCellParentEdge(source);
        let targetParentEdge = this.getCellParentEdge(target);
        let sourceParent = sourceParentEdge.source;
        let targetParent = targetParentEdge.source;
        let sourceEdgeIndex = sourceParent.getEdgeIndex(this.getCellParentEdge(source));
        let targetEdgeIndex = targetParent.getEdgeIndex(this.getCellParentEdge(target));

        this.modeler.model.beginUpdate();
        try {
            this.swapEdgesSameLevel(sourceParent, targetParent, sourceEdgeIndex, targetEdgeIndex);
        } finally {
            this.modeler.layout.execute(this.modeler.parent);
            this.modeler.model.endUpdate();
        }    
    }

    private transactorReorder(source: mxgraph.mxCell, target: mxgraph.mxCell): void {
        let sourceParentEdge = this.getCellParentEdge(source);
        let targetParentEdge = this.getCellParentEdge(target);
        let sourceParent = sourceParentEdge.source;
        let targetParent = targetParentEdge.source;
        let sourceEdgeIndex = sourceParent.getEdgeIndex(this.getCellParentEdge(source));
        let targetEdgeIndex = targetParent.getEdgeIndex(this.getCellParentEdge(target));

        this.modeler.model.beginUpdate();
        try {
            this.swapEdgesAnyLevel(sourceParent, targetParent, sourceEdgeIndex, targetEdgeIndex);
        } finally {
            this.modeler.layout.execute(this.modeler.parent);
            this.modeler.model.endUpdate();
        }    
    }

    private getCellParentEdge(cell: mxgraph.mxCell): mxgraph.mxCell {
        for (let edge of cell.edges) {
            if (edge.target == cell) {
                return edge;
            }
        }

        return null;
    }

    private swapEdgesSameParent(parent: mxgraph.mxCell, from: number, to: number): void {
        let edit = new customEdgeChangeSameParent(parent, from, to);
        this.modeler.model.execute(edit);
    }

    private swapEdgesSameLevel(sourceParent: mxgraph.mxCell, targetParent: mxgraph.mxCell, from: number, to: number): void {
        let edit = new customEdgeChangeSameLevel(sourceParent, targetParent, from, to, this.modeler);
        this.modeler.model.execute(edit);
    }

    private swapEdgesAnyLevel(sourceParent: mxgraph.mxCell, targetParent: mxgraph.mxCell, from: number, to: number): void {
        let edit = null;
        let sourceCell = sourceParent.edges[from].target;
        let targetCell = targetParent.edges[to].target;

        if (!this.isSameSubtree(sourceCell, targetCell)) {
            edit = new customEdgeChangeSameLevel(sourceParent, targetParent, from, to, this.modeler);
        } else if (this.findParent(sourceCell) == targetCell || this.findParent(targetCell) == sourceCell) {
            edit = new customEdgeChangeParentChild(sourceParent, targetParent, from, to, this.modeler);
        } else {
            edit = new customEdgeChangeAnyLevel(sourceParent, targetParent, from, to, this.modeler);
        }
        this.modeler.model.execute(edit);
    }

    // Returns the two closest cells of the same process, if the two closest are not part of the same process, returns only the closest one
    private getClosestCells(x: number, y: number, draggedCell: mxgraph.mxCell): [mxgraph.mxCell, mxgraph.mxCell] {
        let allCells = this.modeler.graph.getChildVertices(this.modeler.parent);
        let bestDistance: number = Infinity;
        let secondBestDistance: number = Infinity;
        let bestCell: mxgraph.mxCell = null;
        let secondBestCell: mxgraph.mxCell = null;
        for (let cell of allCells) {
            let state = this.modeler.graph.view.getState(cell);
            let distance = Infinity;
            if (cell.geometry.height > 100 || state.height > 100) {
                distance = this.getDistanceSampled(x, y, state.getCenterX(), state.getCenterY(), state.height);
            } else {
                distance = this.getDistance(x, y, state.getCenterX(), state.getCenterY());
            }

            if (distance < bestDistance && this.isAppendable(cell)) {
                if (bestCell) {
                    secondBestDistance = bestDistance;
                    secondBestCell = bestCell;
                }
                bestDistance = distance;
                bestCell = cell;
            } else if (distance < secondBestDistance && this.isAppendable(cell)) {
                secondBestDistance = distance;
                secondBestCell = cell;
            }
        }

        // If the closest cell is the dragged cell, return null so there is room to cancel the drag & drop
        if (bestCell == draggedCell) {
            return null;
        }

        if (this.findProcess(bestCell) != this.findProcess(secondBestCell)) {
            return [bestCell, null];
        }

        return [bestCell, secondBestCell];
    }

    private getDistanceSampled(x1: number, y1: number, x2: number, y2: number, cellHeight: number): number {
        let cellTop = y2 - (cellHeight / 2);
        let cellBottom = cellTop + cellHeight;

        let best = this.getDistance(x1, y1, x2, cellBottom);
        for (let sample = cellTop; sample <= cellBottom; sample += 30) {
            let current = this.getDistance(x1, y1, x2, sample);
            if (current < best) {
                best = current;
            }
        }

        return best;
    }

    private getDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(((x1-x2)*(x1-x2)) + ((y1-y2)*(y1-y2)));
    }

    private isSameSubtree(firstCell: mxgraph.mxCell, secondCell: mxgraph.mxCell): boolean {
        return this.lookUpForCell(firstCell, secondCell) || this.lookDownForCell(firstCell, secondCell);
    }

    private isAppendable(cell: mxgraph.mxCell): boolean {
        let correctType = cell.value.tagName == ModelerConstants.ACTOR_ROLE_NAME ||
               cell.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME ||
               cell.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME;

        return correctType;
    }

    private lookUpForCell(traverse: mxgraph.mxCell, lookFor: mxgraph.mxCell): boolean {
        while (traverse = this.findParent(traverse)) {
            if (traverse == lookFor) {
                return true;
            }
        }
        return false;
    }

    private lookDownForCell(traverse: mxgraph.mxCell, lookFor: mxgraph.mxCell): boolean {
        let children = this.findChildren(traverse);
        for (let child of children) {
            if (child == lookFor || this.lookDownForCell(child, lookFor)) {
                return true;
            }
        }
        return false;
    }

    private findProcess(traverse: mxgraph.mxCell): mxgraph.mxCell {
        while (traverse = this.findParent(traverse)) {
            if (traverse.value && traverse.value.tagName == ModelerConstants.PROCESS_NAME) {
                return traverse;
            }
        }
        return null;
    }

    private findParent(cell: mxgraph.mxCell): mxgraph.mxCell {
        for (let edge of cell.edges) {
            if (edge.target == cell) {
                return edge.source;
            }
        }
        return null;
    }

    private findChildren(cell: mxgraph.mxCell): mxgraph.mxCell[] {
        let tmp = new Array<mxgraph.mxCell>();
        for (let edge of cell.edges) {
            if (edge.source == cell) {
                tmp.push(edge.target);
            }
        }
        return tmp;
    }

    get modeler(): Modeler {
        return this._modeler;
    }

}

// Custom command for undo/redo
class customEdgeChangeSameParent {
    public parent: mxgraph.mxCell;
    public from: number;
    public to: number;

    constructor(parent: mxgraph.mxCell, from: number, to: number) {
        this.parent = parent;
        this.from = from;
        this.to = to;
    }

    public execute() {
        if (this.parent) {
            let tmp = this.parent.edges[this.from];
            this.parent.edges[this.from] = this.parent.edges[this.to];
            this.parent.edges[this.to] = tmp;
        }
    }
}

// Custom command for undo/redo
class customEdgeChangeSameLevel {
    public sourceParent: mxgraph.mxCell;
    public targetParent: mxgraph.mxCell;
    public from: number;
    public to: number;
    public modeler: Modeler;

    constructor(sourceParent: mxgraph.mxCell, targetParent: mxgraph.mxCell, from: number, to: number, modeler: Modeler) {
        this.sourceParent = sourceParent;
        this.targetParent = targetParent;
        this.from = from;
        this.to = to;
        this.modeler = modeler;
    }

    public execute() {
        if (this.sourceParent && this.targetParent) {
            let sourceEdge = this.sourceParent.edges[this.from];
            let targetEdge = this.targetParent.edges[this.to];

            // Unlike other customEdge commands, edges are not swapped, only rerouted
            let tmp = this.sourceParent.edges[this.from];
            this.sourceParent.edges[this.from] = this.targetParent.edges[this.to];
            this.targetParent.edges[this.to] = tmp;
            
            // Update edge's parents
            sourceEdge.source = this.targetParent;
            targetEdge.source = this.sourceParent;

            // Update view for auto layout
            this.modeler.redrawCell(this.targetParent);
            this.modeler.redrawCell(this.sourceParent);
        }
    }
}

// Custom command for undo/redo
class customEdgeChangeAnyLevel {
    public sourceParent: mxgraph.mxCell;
    public targetParent: mxgraph.mxCell;
    public sourceParentCellEdge: mxgraph.mxCell;
    public targetParentCellEdge: mxgraph.mxCell;
    public modeler: Modeler;

    constructor(sourceParent: mxgraph.mxCell, targetParent: mxgraph.mxCell, from: number, to: number, modeler: Modeler) {
        this.sourceParent = sourceParent;
        this.targetParent = targetParent;
        this.sourceParentCellEdge = sourceParent.edges[from];
        this.targetParentCellEdge = targetParent.edges[to];
        this.modeler = modeler;
    }

    public execute() {
        if (this.sourceParent && this.targetParent) {
            let sourceCell = this.sourceParentCellEdge.target;
            let targetCell = this.targetParentCellEdge.target;

            // Swap edges of the two vertices
            let tmpEdges = sourceCell.edges;
            sourceCell.edges = targetCell.edges;
            targetCell.edges = tmpEdges;

            // Update sourceCell's references
            for (let edge of sourceCell.edges) {
                if (edge.source == targetCell) {
                    edge.source = sourceCell;
                } else if (edge.target == targetCell) {
                    edge.target = sourceCell;
                }
            }

            // Update targetCell's references
            for (let edge of targetCell.edges) {
                if (edge.source == sourceCell) {
                    edge.source = targetCell;
                } else if (edge.target == sourceCell) {
                    edge.target = targetCell;
                }
            }

            // Update everything so that the auto layout works even with swap across multiple levels
            this.modeler.redrawCell(targetCell);
            this.modeler.redrawCell(sourceCell);
            this.modeler.redrawCell(this.targetParent);
            this.modeler.redrawCell(this.sourceParent);
        }
    }
}

// Custom command for undo/redo
class customEdgeChangeParentChild {
    public sourceParent: mxgraph.mxCell;
    public targetParent: mxgraph.mxCell;
    public sourceParentCellEdge: mxgraph.mxCell;
    public targetParentCellEdge: mxgraph.mxCell;
    public modeler: Modeler;

    constructor(sourceParent: mxgraph.mxCell, targetParent: mxgraph.mxCell, from: number, to: number, modeler: Modeler) {
        this.sourceParent = sourceParent;
        this.targetParent = targetParent;
        this.sourceParentCellEdge = sourceParent.edges[from];
        this.targetParentCellEdge = targetParent.edges[to];
        this.modeler = modeler;
    }

    public execute() {
        // Makes sure the connection is always sourceCell -> targetCell
        if (this.findParent(this.sourceParentCellEdge.target) == this.targetParentCellEdge.target) {
            let tmpParent = this.sourceParent;
            this.sourceParent = this.targetParent;
            this.targetParent = tmpParent;
            let tmpEdge = this.sourceParentCellEdge;
            this.sourceParentCellEdge = this.targetParentCellEdge;
            this.targetParentCellEdge = tmpEdge;
        }

        let sourceCell = this.sourceParentCellEdge.target;
        let targetCell = this.targetParentCellEdge.target;        

        // Swap edges of the two vertices
        let tmpEdges = sourceCell.edges;
        sourceCell.edges = targetCell.edges;
        targetCell.edges = tmpEdges;

        // Update sourceCell's references, sourceCell -> targetCell is ignored
        for (let edge of sourceCell.edges) {
            if ((edge.source == sourceCell && edge.target == targetCell) || (edge.source == targetCell && edge.target == sourceCell)) {
            } else if (edge.source == targetCell) {
                edge.source = sourceCell;
            } else if (edge.target == targetCell) {
                edge.target = sourceCell;
            }
        }

        // Update targetCells's references, sourceCell -> targetCell is ignored
        for (let edge of targetCell.edges) {
            if ((edge.source == sourceCell && edge.target == targetCell) || (edge.source == targetCell && edge.target == sourceCell)) {
            } else if (edge.source == sourceCell) {
                edge.source = targetCell;
            } else if (edge.target == sourceCell) {
                edge.target = targetCell;
            }
        }

        // Special case: find the connection sourceCell -> targetCell and swap the edge around
        for (let edge of sourceCell.edges) {
            if ((edge.source == sourceCell && edge.target == targetCell) || (edge.source == targetCell && edge.target == sourceCell)) {
                let tmpTarget = edge.source;
                edge.source = edge.target;
                edge.target = tmpTarget;
            }
        }

        // Redraw exactly these for Undo/Redo support and automatic layout. You touch it you break it.
        this.modeler.redrawCell(targetCell);
        this.modeler.redrawCell(this.targetParent);
        this.modeler.redrawCell(this.sourceParent);

        // This makes sure the operation is symmetrical, so undo/redo works.
        this.targetParent = this.sourceParent;
        this.sourceParent = targetCell;
    }

    private findParent(cell: mxgraph.mxCell): mxgraph.mxCell {
        for (let edge of cell.edges) {
            if (edge.target == cell) {
                return edge.source;
            }
        }
        return null;
    }
}

// Custom command for undo/redo
class customEdgeChangeAppend {
    public toAppend: mxgraph.mxCell;
    public target: mxgraph.mxCell;
    public modeler: Modeler;

    constructor(toAppend: mxgraph.mxCell, target: mxgraph.mxCell, modeler: Modeler) {
        this.toAppend = toAppend;
        this.target = target;
        this.modeler = modeler;
    }

    public execute() {
        if (this.toAppend && this.target) {
            let currentEdge = this.findParentEdge(this.toAppend);
            let currentParent = currentEdge.source;

            // Remove current edge from current parent
            currentParent.edges = currentParent.edges.filter(edge => edge != currentEdge);
            // Update the new parent in edge
            currentEdge.source = this.target;
            // Push the edge to new parent
            this.target.edges.push(currentEdge);

            this.modeler.redrawCell(this.target);

            // Makes sure undo and redo work properly
            this.target = currentParent;
        }
    }

    private findParentEdge(cell: mxgraph.mxCell): mxgraph.mxCell {
        for (let edge of cell.edges) {
            if (edge.target == cell) {
                return edge;
            }
        }
        return null;
    }
}

// Custom command for undo/redo
class customPutCellBetweenTwo {
    public toAppend: mxgraph.mxCell;
    public between: [mxgraph.mxCell, mxgraph.mxCell];
    public parent: mxgraph.mxCell;
    public differentParents: boolean;
    public prevY: number;
    public modeler: Modeler;

    constructor(toAppend: mxgraph.mxCell, between: [mxgraph.mxCell, mxgraph.mxCell], parent:mxgraph.mxCell, differentParents: boolean, prevY: number, modeler: Modeler) {
        this.toAppend = toAppend;
        this.between = between;
        this.parent = parent;
        this.differentParents = differentParents;
        this.prevY = prevY;
        this.modeler = modeler;
    }

    public execute() {
        if (this.toAppend && this.between && this.parent) {
            let edges = this.parent.edges;
            let indexToPutElement = -1;
            let indexOfMovedElement = -1;

            for (let i = 0; i < edges.length; ++i) {
                if (indexToPutElement == -1 && (edges[i].target == this.between[0] || edges[i].target == this.between[1])) {
                    indexToPutElement = i + 1;
                }

                if (edges[i].target == this.toAppend) {
                    indexOfMovedElement = i;
                }
            }

            if (this.differentParents && (indexToPutElement != edges.length - 1) ||
               (edges.length == 3 && this.prevY < this.between[0].geometry.y)) {
                --indexToPutElement;
            }
                
            if (indexToPutElement < 0 || indexOfMovedElement < 0) {
                return;
            }

            let edge = edges[indexOfMovedElement];
            this.parent.edges.splice(indexOfMovedElement, 1);
            this.parent.edges.splice(indexToPutElement, 0, edge);
        }
    }
}
import { Modeler } from '../modeler-initializator';
import { mxgraph } from 'mxgraph';
import { ModelerConstants } from '../defines-constants';

const mx = require('mxgraph')({
    mxImageBasePath: '/assets/mxgraph/images',
    mxBasePath: '/assets/mxgraph'
});

export class CellResizer {
    private _modeler: Modeler;

    constructor(modeler: Modeler) {
        this._modeler = modeler;
    }

    public updateCellSizesRecursively(cell: mxgraph.mxCell) {
        if (cell) {
            let parent = this.getParent(cell);
            if (parent) {
                this.updateCellSizes(parent);
                this.modeler.layout.execute(this.modeler.parent);
                this.updateCellLinks(parent);
                this.modeler.layout.execute(this.modeler.parent);
            }
        }
    }

    public updateParentSizesRecursively(parent: mxgraph.mxCell) {
        if (parent) {
            this.updateCellSizes(parent);
            this.modeler.layout.execute(this.modeler.parent);
            this.updateCellLinks(parent);
            this.modeler.layout.execute(this.modeler.parent);
        }
    }

    private updateCellSizes(cell: mxgraph.mxCell) {
        let parent = this.getParent(cell);
        if (!parent || !cell || !cell.value || cell.value.tagName == ModelerConstants.PROCESS_NAME) {
            return;
        }

        this.modeler.layout.execute(this.modeler.parent);
        this.updateCellHeight(cell, this.getPreferedHeight(cell));
        this.updateCellSizes(parent);
    }

    private updateCellLinks(cell: mxgraph.mxCell) {
        let parent = this.getParent(cell);
        if (!parent || !cell || !cell.value || cell.value.tagName == ModelerConstants.PROCESS_NAME) {
            return;
        }

        this.updateLinks(cell);
        this.updateCellLinks(parent);
    }

    private updateCellHeight(cell: mxgraph.mxCell, height: number) {
        if (cell.geometry.height == height) {
            return;
        }
        let oldHeight = cell.geometry.height;
        
        let geo = this.graph.model.getGeometry(cell).clone();
        geo.height = height;
        this.graph.model.setGeometry(cell, geo);

        let style = cell.style;
        
        let index = style.indexOf(ModelerConstants.STYLE_IMAGE_SEARCH) + ModelerConstants.STYLE_IMAGE_SEARCH.length;
        let svgImage = atob(style.substring(index).slice(0, -1));

        style = style.substring(0, index);

        if (cell.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME) {
            style += btoa(this.updateElementaryStyle(svgImage, height, oldHeight)) + ";";
        } else if (cell.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME) {
            style += btoa(this.updateSelfActivatingStyle(svgImage, height, oldHeight)) + ";";
        } else if (cell.value.tagName == ModelerConstants.ACTOR_ROLE_NAME) {
            style += btoa(this.updateActorStyle(svgImage, height, oldHeight)) + ";";
        } else {
            return;
        }

        this.modeler.model.setStyle(cell, style);
    }

    public updateElementaryStyle(style: string, height: number, oldHeight: number): string {
        let res = style.replace('<svg width="130" height="' + oldHeight.toString() + '"', '<svg width="130" height="' + height.toString() + '"');

        let rectRotateY = (height / 2);
        let rectY = (height / 2) - 20;
        let textY = (height / 2) + 7;
        res = this.removeBetweenStringsAndReplaceWith(res, '<rect transform="rotate(45, 31.5, ', ')" x="11.5" ', rectRotateY.toString());
        res = this.removeBetweenStringsAndReplaceWith(res, ')" x="11.5" y="', '" width="40" height="40"', rectY.toString());
        res = this.removeBetweenStringsAndReplaceWith(res, '<text y="', '" x="32" xml:space="preserve"', textY.toString());

        return res;
    }

    public updateSelfActivatingStyle(style: string, height: number, oldHeight: number): string {
        let res = style.replace('<svg width="100" height="' + oldHeight.toString() + '"', '<svg width="100" height="' + height.toString() + '"');

        let rectRotateY = (height / 2);
        let rectY = (height / 2) - 20;
        let textY = (height / 2) + 7;
        res = this.removeBetweenStringsAndReplaceWith(res, '<rect transform="rotate(45, 50, ', ')" y="', rectRotateY.toString());
        res = this.removeBetweenStringsAndReplaceWith(res, ')" y="', '" x="30" height="40" width="40"', rectY.toString());
        res = this.removeBetweenStringsAndReplaceWith(res, '<text x="50" y="', '" text-anchor="middle"', textY.toString());

        return res;
    }

    public updateActorStyle(style: string, height: number, oldHeight: number): string {
        let res = style.replace('<svg width="100" height="' + oldHeight.toString() + '"', '<svg width="100" height="' + height.toString() + '"');
        
        return res;
    }

    private updateLinks(cell: mxgraph.mxCell): void {
        if (cell.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME || cell.value.tagName == ModelerConstants.SELF_ACTIVATING_ROLE_NAME) {
            this.updateConditionalLinks(cell);
            this.updateInitiatorLinks(cell);
        }
        if (cell.value.tagName == ModelerConstants.ACTOR_ROLE_NAME) {
            this.updateInitiatorLinks(cell);
        }
    }

    private updateInitiatorLinks(cell: mxgraph.mxCell): void {
        for (let edge of this.getCellInitiatorLinks(cell)) {
            let absDiff = Math.abs(edge.target.geometry.getCenterY() - cell.geometry.y);
            let relDiff = absDiff / cell.geometry.height;
            
            let newStyle = this.removeBetweenStringsAndReplaceWith(edge.style, ';exitY=', ';html=1;', relDiff.toString());
            this.modeler.model.setStyle(edge, newStyle);
        }
    }

    private getCellInitiatorLinks(cell: mxgraph.mxCell): Array<mxgraph.mxCell> {
        let res = Array<mxgraph.mxCell>();
        if (cell.edges) {
            for (let edge of cell.edges) {
                if (edge.source == cell) {
                    res.push(edge);
                }
            }
        }

        return res;
    }

    private updateConditionalLinks(cell: mxgraph.mxCell): void {
        let cellHeight = cell.geometry.height;
        let absolutePos = (cellHeight / 2) - ModelerConstants.CONSTRAINT_LINK_SOURCE_ELEMENTARY_OF_PX;
        let relativePosUp = absolutePos / cellHeight;
        let relativePosDown = 1 - relativePosUp;

        for (let edge of this.getCellCondtionalLinks(cell)) {
            let newStyle = edge.style;
            if (edge.value.getAttribute("linkOrientationSource") == ModelerConstants.LINK_ORIENTATION_DOWN) {
                newStyle = this.removeBetweenStringsAndReplaceWith(newStyle, ';exitY=', ';entryX=', relativePosDown.toString());
            } else {
                newStyle = this.removeBetweenStringsAndReplaceWith(newStyle, ';exitY=', ';entryX=', relativePosUp.toString());
            }
            let newValue = edge.value.cloneNode(true);
            newValue.setAttribute("relativeYUp", relativePosUp.toString());
            newValue.setAttribute("relativeYDown", relativePosDown.toString());

            this.modeler.model.setValue(edge, newValue);
            this.modeler.model.setStyle(edge, newStyle);
        }
    }

    private getCellCondtionalLinks(cell: mxgraph.mxCell): Array<mxgraph.mxCell> {
        let res = Array<mxgraph.mxCell>();
        if (cell.children) {
            for (let child of cell.children) {
                if (child.edges) {
                    for (let edge of child.edges) {
                        if (edge.value && edge.value.tagName == ModelerConstants.CONSTARINT_LINK_NAME) {
                            res.push(edge);
                        }
                    }
                }
            }

            if (cell.edges) {
                for (let edge of cell.edges) {
                    if (edge.value && edge.value.tagName == ModelerConstants.CONSTARINT_LINK_NAME) {
                        res.push(edge);
                    }
                }
            }
        }

        return res;
    }

    private removeBetweenStringsAndReplaceWith(original: string, first: string, second: string, replaceWith: string): string {
        let res = "";
        let indexPre = original.indexOf(first) + first.length;
        let indexAfter = original.indexOf(second);
        res = original.substring(0, indexPre) + replaceWith + original.substring(indexAfter);

        return res;
    }

    private getPreferedHeight(cell: mxgraph.mxCell): number {
        let top = Infinity;
        let bottom = -Infinity;

        for (let edge of cell.edges) {
            if (edge.source == cell && edge.value && edge.value.tagName == ModelerConstants.LINKTYPE_DEFAULT) {
                let cellTop = edge.target.geometry.y;
                let cellBottom = cellTop + edge.target.geometry.height;
                if (cellTop < top) {
                    top = cellTop;
                }
                if (cellBottom > bottom) {
                    bottom = cellBottom;
                }
            }
        }

        if (top == Infinity || bottom == -Infinity) {
            return 100;
        }

        return bottom - top;
    }

    public getParent(cell: mxgraph.mxCell): mxgraph.mxCell {
        for (let edge of cell.edges) {
            if (edge.target == cell) {
                return edge.source;
            }
        }

        return null;
    }

    get modeler(): Modeler {
        return this._modeler;
    }

    get graph(): mxgraph.mxGraph {
        return this._modeler.graph;
    }
}
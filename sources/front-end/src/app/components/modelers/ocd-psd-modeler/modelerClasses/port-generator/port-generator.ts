import { mxgraph } from 'mxgraph';
import { ModelerConstants } from '../defines-constants';
import { Modeler } from '../modeler-initializator';
import { SynchronizationManager as Sync } from '../synchronization-manager';
import * as Mdl from 'src/app/model';
import { Guid } from 'guid-typescript';

const mx = require('mxgraph')({
    mxImageBasePath: '/assets/mxgraph/images',
    mxBasePath: '/assets/mxgraph'
});

export class PortFactory {
    private _modeler: Modeler;

    constructor(modeler: Modeler) {
        this._modeler = modeler;
    }

    public overwriteMxgraphConnections(): void {
        let modeler = this.modeler;
        let graph = this.modeler.graph;
        let fact = this;

        this.modeler.graph.connectionHandler.marker.validColor = ModelerConstants.STYLE_MOUSEOVER_HIGHLIGHT;
        this.modeler.graph.connectionHandler.marker.hotspot = 1;

        this.modeler.graph.connectionHandler.createEdge = function(value: any, source: any, target: any, style: any, isWaitLink?: boolean, linkId?: Guid,
                                                                   optionalCAct?: [string, string], optionalData?: Mdl.LinkPosition) {
            let vertexType: string = source.parent.value.tagName;

            let parentHeight = source.parent.geometry.height;
            let absolutePos = (parentHeight / 2) - ModelerConstants.CONSTRAINT_LINK_SOURCE_ELEMENTARY_OF_PX;
            let relativePosUp = absolutePos / parentHeight;
            let relativePosDown = 1 - relativePosUp;

            let edge: mxgraph.mxCell = new mx.mxCell('', new mx.mxGeometry());
            edge.setEdge(true);

            let childGeometry = new mx.mxGeometry(-1, 0, 0, 0);
            childGeometry.offset = new mx.mxPoint(-7, 7);
            let orientationSource = ModelerConstants.LINK_ORIENTATION_UP;
            let orientationTarget = ModelerConstants.LINK_ORIENTATION_UP;
            
            if (optionalData) {
                if (optionalData.sourcePositionDown) {
                    orientationSource = ModelerConstants.LINK_ORIENTATION_DOWN;
                }
                if (optionalData.targetPositionDown) {
                    orientationTarget = ModelerConstants.LINK_ORIENTATION_DOWN;
                }

                if (vertexType == ModelerConstants.SELF_ACTIVATING_ROLE_NAME) {
                    childGeometry.offset = new mx.mxPoint(25, -1);
                    style = ModelerConstants.CONSTRAINT_LINK_BEGINING + ModelerConstants.CONSTRAINT_LINK_SOURCE_SELF_ACTIVATING + 
                            (optionalData.sourcePositionDown ? relativePosDown.toString() : relativePosUp.toString()) + ";" +
                            (optionalData.targetPositionDown ? ModelerConstants.CONSTRAINT_LINK_TARGET_DOWN : ModelerConstants.CONSTRAINT_LINK_TARGET_UP) +
                            (isWaitLink ? ModelerConstants.WAITLINK_STYLE : ModelerConstants.INSPECTIONLINK_STYLE);
                } else {       
                    style = ModelerConstants.CONSTRAINT_LINK_BEGINING + ModelerConstants.CONSTRAINT_LINK_SOURCE_ELEMENTARY +
                            (optionalData.sourcePositionDown ? relativePosDown.toString() : relativePosUp.toString()) + ";" +
                            (optionalData.targetPositionDown ? ModelerConstants.CONSTRAINT_LINK_TARGET_DOWN : ModelerConstants.CONSTRAINT_LINK_TARGET_UP) +
                            (isWaitLink ? ModelerConstants.WAITLINK_STYLE : ModelerConstants.INSPECTIONLINK_STYLE);                    
                }
            } else {
                if (vertexType == ModelerConstants.SELF_ACTIVATING_ROLE_NAME) {
                    childGeometry.offset = new mx.mxPoint(25, -1);
                    style = ModelerConstants.CONSTRAINT_LINK_BEGINING + ModelerConstants.CONSTRAINT_LINK_SOURCE_SELF_ACTIVATING + relativePosUp.toString() + ";" +
                            ModelerConstants.CONSTRAINT_LINK_TARGET_UP + ModelerConstants.WAITLINK_STYLE;
                    if (source.value == "waitLinkNodeDown") {
                        style = ModelerConstants.CONSTRAINT_LINK_BEGINING + ModelerConstants.CONSTRAINT_LINK_SOURCE_SELF_ACTIVATING + relativePosDown.toString() + ";" +
                        ModelerConstants.CONSTRAINT_LINK_TARGET_DOWN + ModelerConstants.WAITLINK_STYLE;
                        orientationSource = ModelerConstants.LINK_ORIENTATION_DOWN;
                        orientationTarget = ModelerConstants.LINK_ORIENTATION_DOWN;
                    }
                } else {       
                    style = ModelerConstants.CONSTRAINT_LINK_BEGINING + ModelerConstants.CONSTRAINT_LINK_SOURCE_ELEMENTARY + relativePosUp.toString() + ";" +
                    ModelerConstants.CONSTRAINT_LINK_TARGET_UP + ModelerConstants.WAITLINK_STYLE;    
                    if (source.value == "waitLinkNodeDown") {
                        style = ModelerConstants.CONSTRAINT_LINK_BEGINING + ModelerConstants.CONSTRAINT_LINK_SOURCE_ELEMENTARY + relativePosDown.toString() + ";" +
                        ModelerConstants.CONSTRAINT_LINK_TARGET_DOWN + ModelerConstants.WAITLINK_STYLE;    
                        orientationSource = ModelerConstants.LINK_ORIENTATION_DOWN;
                        orientationTarget = ModelerConstants.LINK_ORIENTATION_DOWN;
                    }
                }
            }

            edge.setStyle(style);
            let node = modeler.cellFactory.xmlDocument.createElement(ModelerConstants.CONSTARINT_LINK_NAME);
            if (optionalData) {
                node.setAttribute("guid", linkId.toString());
                node.setAttribute("label", isWaitLink ? fact.getShortcutFromAct(optionalCAct[1]) : "");
                node.setAttribute("linkType", isWaitLink ? ModelerConstants.LINKTYPE_WAIT : ModelerConstants.LINKTYPE_INSPECTION);
                node.setAttribute("linkActSource", isWaitLink ? optionalCAct[0] : ModelerConstants.LINK_ACT_REQUEST);
                node.setAttribute("linkOrientationSource", orientationSource);
                node.setAttribute("linkActTarget", isWaitLink ? optionalCAct[1] : ModelerConstants.LINK_ACT_REQUEST);
                node.setAttribute("linkOrientationTarget", orientationTarget);
                node.setAttribute("relativeYUp", relativePosUp.toString());
                node.setAttribute("relativeYDown", relativePosDown.toString());
            } else {
                let guid = Guid.create();
                node.setAttribute("guid", guid.toString());
                node.setAttribute("label", ModelerConstants.LINK_ACT_REQUEST_S);
                node.setAttribute("linkType", ModelerConstants.LINKTYPE_WAIT);
                node.setAttribute("linkActSource", ModelerConstants.LINK_ACT_REQUEST);
                node.setAttribute("linkOrientationSource", orientationSource);
                node.setAttribute("linkActTarget", ModelerConstants.LINK_ACT_REQUEST);
                node.setAttribute("linkOrientationTarget", orientationTarget);
                node.setAttribute("relativeYUp", relativePosUp.toString());
                node.setAttribute("relativeYDown", relativePosDown.toString());
            }
            
            edge.value = node;

            edge.geometry.relative = true;
            edge.geometry.x = 1;
            edge.geometry.y = 0;
            if (orientationTarget == ModelerConstants.LINK_ORIENTATION_UP) {
                edge.geometry.offset = new mx.mxPoint(ModelerConstants.CONSTRAINT_LINK_LABEL_X, ModelerConstants.CONSTRAINT_LINK_LABEL_Y_UP);
            } else {
                edge.geometry.offset = new mx.mxPoint(ModelerConstants.CONSTRAINT_LINK_LABEL_X, ModelerConstants.CONSTRAINT_LINK_LABEL_Y_DOWN);
            }

            let nodeChild = modeler.cellFactory.xmlDocument.createElement("childLabel");
            if (optionalData) {
                nodeChild.setAttribute("label", isWaitLink ? fact.getShortcutFromAct(optionalCAct[0]) : "");
            } else {
                nodeChild.setAttribute("label", ModelerConstants.LINK_ACT_REQUEST_S);
            }
            let sourceLabel = new mx.mxCell(nodeChild, childGeometry, "resizable=0;align=right;verticalAlign=bottom;fontColor=#000000;");
            sourceLabel.geometry.relative = true;
            sourceLabel.setConnectable(false);
            sourceLabel.vertex = true;
            edge.insert(sourceLabel);

            return edge;
        };

        this.modeler.graph.connectionHandler.addListener(mx.mxEvent.CONNECT, (sender, evt) => {
            // On wait link connect, change source to parent (transactor)
            evt.properties.cell.source = evt.properties.cell.source.parent;
            let cell = evt.properties.cell;
            modeler.redrawCell(cell);
            Sync.sendAddWaitLink(cell.value.getAttribute("guid"), cell.source.value.getAttribute("guid"), cell.target.value.getAttribute("guid"), cell.value.getAttribute("linkOrientationSource") == ModelerConstants.LINK_ORIENTATION_DOWN, new Array<[number, number]>());
        });

        this.modeler.graph.getModel().addListener(mx.mxEvent.CHANGE, (sender, evt) => {
            if (evt.properties.changes.length == 1) {
                for (let change of evt.properties.changes) {
                    if (change.cell && change.geometry && change.geometry.points && change.cell.value && change.cell.value.tagName == ModelerConstants.CONSTARINT_LINK_NAME) {
                        let graphicalPoints = this.getPointsFromTerminals(change.cell.geometry.points);
                        Sync.sendChangeWaitLink(change.cell.value.getAttribute("guid"), null, null, null, null, null, graphicalPoints);
                    }
                }
            }            
        });
        
        let startingNode = null;
        this.modeler.graph.connectionHandler.isConnectableCell = function(cell) {
			if (this.graph.getModel().isEdge(cell)) {
				return false;
			} else {
                if (cell) {                    
                    let vertexType: string = cell.value.tagName;
                    let connectingEdge = graph.connectionHandler.isConnecting();
                    
                    if (connectingEdge && 
                        (vertexType == ModelerConstants.ELEMENTARY_ROLE_NAME || 
                        vertexType == ModelerConstants.SELF_ACTIVATING_ROLE_NAME) &&
                        cell != startingNode.parent
                        ) {
                        return true;
                    }

                    if (!connectingEdge && (cell.value == "waitLinkNode" || cell.value == "waitLinkNodeDown")) {
                        startingNode = cell;

                        return true;
                    }
                    return false;
                }
                
				return false;
			}
        };
        
		mx.mxEdgeHandler.prototype.isConnectableCell = function(cell) {
			return this.graph.connectionHandler.isConnectableCell(cell);
		};
    }

    public addPortsToVertex(cell: mxgraph.mxCell): void {
        let waitNode = this.modeler.cellFactory.createWaitLinkNode();
        
        // UPWARD NODE
        let waitLinkInputUp = this.modeler.graph.insertVertex(cell, null, waitNode.node, 0, 0, waitNode.width, waitNode.height, waitNode.style);
        waitLinkInputUp.geometry.relative = true;
        
        let [xU, yU] = waitNode.textOffset();
        if (cell.value && cell.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME) {
            [xU, yU] = waitNode.textOffsetElementary();
        }

        waitLinkInputUp.geometry.offset = new mx.mxPoint(xU, yU);
        this.modeler.setCellVisibility(waitLinkInputUp, false);
        
        // DOWNWARD NODE
        let waitNodeDown = this.modeler.cellFactory.createWaitLinkNodeDown();
        let waitLinkInputDown = this.modeler.graph.insertVertex(cell, null, waitNodeDown.node, 0, 1, waitNodeDown.width, waitNodeDown.height, waitNodeDown.style);
        waitLinkInputDown.geometry.relative = true;
        
        let [xD, yD] = waitNodeDown.textOffsetDown();
        if (cell.value && cell.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME) {
            [xD, yD] = waitNodeDown.textOffsetElementaryDown();
        }

        waitLinkInputDown.geometry.offset = new mx.mxPoint(xD, yD);
        this.modeler.setCellVisibility(waitLinkInputDown, false);
    }

    public addActorLabel(cell: mxgraph.mxCell): void {
        let actorLabel = this.modeler.cellFactory.createActorLabel(cell.value.getAttribute("actorLabel"));
        let x = 0;
        if (cell.value && cell.value.tagName == ModelerConstants.ELEMENTARY_ROLE_NAME) {
            x = 31;
        }
        this.modeler.graph.insertVertex(cell, null, actorLabel.node, x, 0, actorLabel.width, actorLabel.height, actorLabel.style + "movable=0;selectable=0;verticalAlign=top;");
    }

    private getPointsFromTerminals(points): Array<[number, number]> {
        let graphicalPoints = new Array<[number, number]>();
        for (let i = 0; i < points.length; ++i) {
            graphicalPoints.push([points[i].x, points[i].y]);
        }
        return graphicalPoints;
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

    get modeler() {
        return this._modeler;
    }
}
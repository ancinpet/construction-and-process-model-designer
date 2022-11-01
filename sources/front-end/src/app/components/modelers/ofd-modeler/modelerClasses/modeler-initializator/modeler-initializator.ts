import MxGraphFactory, { mxgraph } from "mxgraph";
import { FatalError } from "../../../../../directives/utils/exceptions";
import { ModelerConstants } from '../defines-constants';
import { ShapesInit } from '../shapes-initializator';
// import { StateManagerService } from 'src/app/services/state-management/state-manager.service';

// Prepare MxGraph
const mx = require('mxgraph')({
    mxImageBasePath: '/assets/mxgraph/images',
    mxBasePath: '/assets/mxgraph'
});

export class Modeler {
    container: HTMLElement;
    rubberband: mxgraph.mxRubberband;
    editor: mxgraph.mxEditor;
    elements: Array<mxgraph.mxCell>;
    graph: mxgraph.mxGraph;

    public _cellTracker: mxgraph.mxCellTracker;
    private _layout: mxgraph.mxCompactTreeLayout;
    private _shapesInit: ShapesInit;

    constructor(container: HTMLElement) 
    {
        console.log(mx);
        this.container = container;
        if (!mx.mxClient.isBrowserSupported()) 
        {
            container.innerHTML = "Browser is not supported. Please make sure you are using up to date browser.";
            throw new FatalError("Browser is not supported.");
        }
        mx.mxEvent.disableContextMenu(container);
        this.editor = new mx.mxEditor();                
        this.setupDynamicToolbarOfd();
        this.editor.setGraphContainer(this.container);
        this.graph = (<any>this.editor).graph;
        
        this.graph.connectionHandler.createEdgeState = function(me)
        {
            var edge = this.graph.createEdge(null, null, null, null, null, 'edgeStyle=orthogonalEdgeStyle');
            
            return new mx.mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge));
        };
        var rubberband = new mx.mxRubberband(this.graph);

        // this.graph.isCellLocked = function(cell) {
        //     return this.isCellsLocked();
        // }
        // this.graph.isCellResizable = function(cell) {
        //     var geo = this.model.getGeometry(cell);
        //     return geo == null || !geo.relative;
        // }
        // this.graph.isWrapping = function(cell) {
        //     return this.model.isCollapsed(cell);
        // }
        // this.graph.isLabelClipped = function(cell) {
        //     var geometry = this.model.getGeometry(cell);
        //     return geometry != null && !geometry.relative && (geometry.offset == null || (geometry.offset.x == 0 && geometry.offset.y == 0));
        // }
        this.graph.isCellEditable = function(cell){
            return !this.model.isEdge(cell);
        };

        this._layout = new mx.mxCompactTreeLayout(this.graph);
        this._shapesInit = new ShapesInit(mx);
    }

    public customizeModeler(): void {
        this.customResize();
        this.customAnchors();
        this.customGuides();
        // Disables default browser right click menu
        mx.mxEvent.disableContextMenu(this.graph.container);
        this.graph.setTooltips(true);
        this.graph.setAllowDanglingEdges(true);
        this.graph.setCellsDisconnectable(true);
        this.graph.setCellsResizable(true);
        this.graph.setCellsCloneable(false);
        this.graph.setHtmlLabels(true);
        this.graph.setConnectable(true);
        this.graph.setMultigraph(false);
        this.graph.setConnectableEdges(false);
        this.graph.setDisconnectOnMove(false);
        this.graph.foldingEnabled = false;
		this.graph.constrainChildren = false;
		this.graph.constrainRelativeChildren = true;
        this.graph.setEdgeLabelsMovable(false);
        this.graph.setPanning(true);
        this.graph.tooltipHandler.setEnabled(false);
        this.graph.pageBreaksVisible = true;
        this.graph.pageBreakDashed = true;
        this.graph.preferPageSize = true;
        this.graph.pageBreakColor = "#888888";
        this.graph.vertexLabelsMovable = false;
        this.graph.autoSizeCellsOnAdd = true;
        this.graph.connectionHandler.marker.isEnabled = function()
        {
            return this.graph.connectionHandler.first != null;
        };
        // this.graph.graphHandler.setRemoveCellsFromParent(false);
        this.graph.setCellsDeletable(true);
        
        //Edge default style making them solid lines with no direction and also x,y coords of entry and exit
        let edgeStylesheet = this.graph.getStylesheet().getDefaultEdgeStyle();
        edgeStylesheet[mx.mxConstants.STYLE_EDGE] = mx.mxConstants.EDGESTYLE_ORTHOGONAL;
        edgeStylesheet[mx.mxConstants.STYLE_ROUNDED] = 0;
        // edgeStylesheet[mx.mxConstants.STYLE_ENTRY_X] = 0;
        // edgeStylesheet[mx.mxConstants.STYLE_ENTRY_Y] = 0.5;
        // edgeStylesheet[mx.mxConstants.STYLE_ENTRY_PERIMETER] = 0;
        // edgeStylesheet[mx.mxConstants.STYLE_EXIT_X] = 1;
        // edgeStylesheet[mx.mxConstants.STYLE_EXIT_Y] = 0.5;
        edgeStylesheet[mx.mxConstants.STYLE_EXIT_PERIMETER] = 0;
        edgeStylesheet[mx.mxConstants.STYLE_JETTY_SIZE] = "auto";
        edgeStylesheet[mx.mxConstants.STYLE_MOVABLE] = 1;
        edgeStylesheet[mx.mxConstants.STYLE_EDITABLE] = 1;
        edgeStylesheet[mx.mxConstants.STYLE_BENDABLE] = 1;
        edgeStylesheet[mx.mxConstants.STYLE_ROTATABLE] = 0;
        edgeStylesheet[mx.mxConstants.STYLE_STROKECOLOR] = "#000000";
        // edgeStylesheet[mx.mxConstants.STYLE_STARTARROW] = mx.mxConstants.NONE;
        // edgeStylesheet[mx.mxConstants.STYLE_ENDARROW] = mx.mxConstants.NONE;

        // Color when vertex or edge is selected
        mx.mxConstants.VERTEX_SELECTION_COLOR = ModelerConstants.STYLE_SELECTED_HIGHLIGHT;
        mx.mxConstants.VERTEX_SELECTION_STROKEWIDTH = 2;
        mx.mxConstants.VERTEX_SELECTION_DASHED = 1;
        mx.mxConstants.EDGE_SELECTION_COLOR = ModelerConstants.STYLE_SELECTED_HIGHLIGHT;
        mx.mxConstants.EDGE_SELECTION_STROKEWIDTH = 2;
        mx.mxConstants.EDGE_SELECTION_DASHED = 1;
        mx.mxConstants.STYLE_RESIZE_WIDTH = 1;

        var highlight = new mx.mxCellHighlight(this.graph, '#ff0000', 2);
        highlight.highlight(this.graph.view.getState(mx.cell));
        this.updateEdgeStyle();
        // mx.mxShape.prototype.getConstraints = function(style, w, h)
        // {
        //     return null;
        // };

		this.graph.connectionHandler.constraintHandler.isStateIgnored = function(state, source)
		{
			return source && state.view.graph.isCellSelected(state.cell);
        };

		mx.mxConstraintHandler.prototype.createHighlightShape = function()
		{

            this.highlightColor = ModelerConstants.STYLE_MOUSEOVER_HIGHLIGHT;
			var hl = new mx.mxEllipse(null, this.highlightColor, this.highlightColor, 0);
			hl.opacity = mx.mxConstants.HIGHLIGHT_OPACITY;
			
			return hl;
        };
        // mx.mxConstraintHandler.prototype.k

		mx.mxConnectionHandler.prototype.livePreview = true;
        mx.mxConnectionHandler.prototype.cursor = 'crosshair';
    }

    private updateEdgeStyle() : void {
        this.graph.getView().updateStyle = true;
        var previous = this.graph.model.getStyle;
        var graph = this.graph;
        this.graph.model.getStyle = function(cell)
        {
            if (cell != null)
            {
                var style = previous.apply(this, arguments);           
                if (this.isEdge(cell))
                {
                    var target = this.getTerminal(cell, false);
                    if (target != null)
                    {
                        if (target.getId() == 'Prod2')
                            style += 'endArrow=NONE';
                        else
                        {
                            target = this.getTerminal(cell, true);
                            if (target.getId() == 'Prod2')
                                style += 'endArrow=NONE';
                            else
                                style += 'endArrow=classic';
                        }
                    }
                }
            }
            return style;
        }


        // if (selection[0].isConnectable() && selection[1].isConnectable()) {
        //     if (selection[0].getId() != 'Prod' && selection[1].getId() != 'Prod')
        //     {
        //         var x1 = this.graph.insertEdge(this.graph.getDefaultParent(), null, '', selection[0], selection[1], "edgeStyle=orthogonalEdgeStyle;strokeColor=#000000;");
        //         var x2 = this.graph.insertVertex(x1, null, 1, -0.8, 10, 0, 0, null, true);
        //         var x3 = this.graph.insertVertex(x1, null, 1, 0.8, 10, 0, 0, null, true);
        //         x2.setConnectable(false);
        //         x3.setConnectable(false);
        //     }
        //     else if (selection[0].getId() == 'Prod')
        //         var x1 = this.graph.insertEdge(this.graph.getDefaultParent(), null, '', selection[0].children[0], selection[1], "edgeStyle=orthogonalEdgeStyle;strokeColor=#000000;endArrow=NONE");
        //     else if (selection[1].getId() == 'Prod')
        //         var x1 = this.graph.insertEdge(this.graph.getDefaultParent(), null, '', selection[0], selection[1].children[0], "edgeStyle=orthogonalEdgeStyle;strokeColor=#000000;endArrow=NONE");
        //     else
        //         var x1 = this.graph.insertEdge(this.graph.getDefaultParent(), null, '', selection[0].children[0], selection[1].children[0], "edgeStyle=orthogonalEdgeStyle;strokeColor=#000000;endArrow=NONE");

    }

    private addFact(): void {
        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        var parent = this.graph.getDefaultParent();

        // Adds cells to the model in a single step
        this.graph.getModel().beginUpdate();
        try {
            //var x1 = this.graph.insertVertex(parent, null, '', 20, 20, 240, 100, 'shape=image;image=data:image/svg+xml,PHN2ZyB3aWR0aD0iNDEwIiBoZWlnaHQ9IjIxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9IiNmZmYiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIyMTIiIHdpZHRoPSI0MTIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiBpZD0iY2FudmFzR3JpZCI+CiAgIDxyZWN0IGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIiBzdHJva2Utd2lkdGg9IjAiIHk9IjAiIHg9IjAiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz4KICA8L2c+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHJlY3Qgcng9IjUwIiBpZD0ic3ZnXzYiIGhlaWdodD0iMjAwIiB3aWR0aD0iNDAwIiB5PSI1IiB4PSI1IiBmaWxsLW9wYWNpdHk9Im51bGwiIHN0cm9rZS1vcGFjaXR5PSJudWxsIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlPSIjMDAwIiBmaWxsPSIjZmZmIi8+CiA8L2c+Cjwvc3ZnPg==;') 
            var x1 = this.graph.insertVertex(parent, 'Fact', 'Fact', 20, 20, 240, 120, "shape=fact;whiteSpace=wrap;rounded=1;strokeColor=#000000;fillColor=#FFFFFF;verticalAlign=top;spacingTop=0;spacing=0;fontSize=18");
            var x2 = this.graph.insertVertex(x1, null, 'DATA', 0.425, 0.3, 30, 30, "shape=text;strokeColor=#ffffff;fillColor=#FFFFFF;fontSize=18;aling=middle;horizontalAlign=middle;", true)
            x2.setConnectable(false);
            // this.graph.updateCellSize(x3);
            // this.graph.setCellsResizable(true);
            // this.graph.setAutoSizeCells(true);
        }
        finally {
            // Updates the display
            this.graph.getModel().endUpdate();
        }
    }

    private addExternalFact(): void {
        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        var parent = this.graph.getDefaultParent();

        // Adds cells to the model in a single step
        this.graph.getModel().beginUpdate();
        try {
            //var x1 = this.graph.insertVertex(parent, null, '', 20, 20, 80, 50, 'shape=image;image=data:image/svg+xml,PHN2ZyB3aWR0aD0iMjEwIiBoZWlnaHQ9IjExMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIE1ldGhvZCBEcmF3IC0gaHR0cDovL2dpdGh1Yi5jb20vZHVvcGl4ZWwvTWV0aG9kLURyYXcvIC0tPgogPGc+CiAgPHRpdGxlPmJhY2tncm91bmQ8L3RpdGxlPgogIDxyZWN0IGZpbGw9IiNmZmYiIGlkPSJjYW52YXNfYmFja2dyb3VuZCIgaGVpZ2h0PSIxMTIiIHdpZHRoPSIyMTIiIHk9Ii0xIiB4PSItMSIvPgogIDxnIGRpc3BsYXk9Im5vbmUiIG92ZXJmbG93PSJ2aXNpYmxlIiB5PSIwIiB4PSIwIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIiBpZD0iY2FudmFzR3JpZCI+CiAgIDxyZWN0IGZpbGw9InVybCgjZ3JpZHBhdHRlcm4pIiBzdHJva2Utd2lkdGg9IjAiIHk9IjAiIHg9IjAiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiLz4KICA8L2c+CiA8L2c+CiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHJlY3QgaWQ9InN2Z18yIiBoZWlnaHQ9IjEwMCIgd2lkdGg9IjIwMCIgeT0iNSIgeD0iNSIgZmlsbC1vcGFjaXR5PSJudWxsIiBzdHJva2Utb3BhY2l0eT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZT0iIzAwMCIgZmlsbD0iI2ZmZiIvPgogPC9nPgo8L3N2Zz4=;') 
            var x1 = this.graph.insertVertex(parent, 'ExtFact', 'External Fact', 20, 20, 240, 120, "shape=fact;whiteSpace=wrap;rounded=1;strokeColor=#000000;fillColor=#D4D4D4;verticalAlign=top;spacingTop=0;spacing=0;fontSize=18;");
            var x2 = this.graph.insertVertex(x1, null, 'DATA', 0.425, 0.3, 30, 30, "shape=text;strokeColor=#ffffff;fillColor=#D4D4D4;fontSize=18;aling=left;horizontalAlign=left;", true)
        
            x2.setConnectable(false);
        }
        finally {
            // Updates the display
            this.graph.getModel().endUpdate();
        }
    }

    private addProduct(): void {
        var parent = this.graph.getDefaultParent();
        this.graph.getModel().beginUpdate();
        try {
            var x1 = this.graph.insertVertex(parent, null, 'Product', 20, 20, 240, 260, "shape=product;whiteSpace=wrap;rounded=1;strokeColor=#000000;fillColor=#FFFFFF;verticalAlign=top;spacingTop=0;spacing=0;fontSize=18");
            var x2 = this.graph.insertVertex(x1, 'Prod2', 'P?', 0.4, 0.2, 50, 50, "shape=rhombus;whiteSpace=wrap;html=1;rounded=0;shadow=0;glass=0;comic=0;labelBackgroundColor=none;strokeColor=#FF3333;fillColor=#ffffff;fontSize=18;", true);
            var x3 = this.graph.insertVertex(x1, null, 'FACT', 0.425, 0.65, 30, 30, "shape=text;strokeColor=#ffffff;fillColor=#ffffff;fontSize=18;aling=left;horizontalAlign=left", true);
            var x4 = this.graph.insertVertex(x1, null, 'DATA', 0.425, 0.75, 30, 30, "shape=text;strokeColor=#ffffff;fillColor=#ffffff;fontSize=18;aling=left;horizontalAlign=left", true);
            x1.children.forEach(element => {
                console.log(element);
            });
            //var group = this.graph.createGroupCell({x1, x2, x3});
            
            x1.setConnectable(false);
            x3.setConnectable(false);
            x4.setConnectable(false);
            //group.setConnectable(false);
        }
        finally {
            // Updates the display
            this.graph.getModel().endUpdate();
        }
    }

    private addEdge(): void {
        if (this.graph.getSelectionCount() == 2) {
            let selection = this.graph.getSelectionCells();
            this.graph.getModel().beginUpdate();
            try {
                if (selection[0].isConnectable() && selection[1].isConnectable()) {
                    if (selection[0].getId() != 'Prod' && selection[1].getId() != 'Prod')
                    {
                        var x1 = this.graph.insertEdge(this.graph.getDefaultParent(), null, '', selection[0], selection[1], "edgeStyle=orthogonalEdgeStyle;strokeColor=#000000;");
                        var x2 = this.graph.insertVertex(x1, null, 1, -0.8, 10, 0, 0, null, true);
                        var x3 = this.graph.insertVertex(x1, null, 1, 0.8, 10, 0, 0, null, true);
                        x2.setConnectable(false);
                        x3.setConnectable(false);
                    }
                    else if (selection[0].getId() == 'Prod')
                        var x1 = this.graph.insertEdge(this.graph.getDefaultParent(), null, '', selection[0].children[0], selection[1], "edgeStyle=orthogonalEdgeStyle;strokeColor=#000000;endArrow=NONE");
                    else if (selection[1].getId() == 'Prod')
                        var x1 = this.graph.insertEdge(this.graph.getDefaultParent(), null, '', selection[0], selection[1].children[0], "edgeStyle=orthogonalEdgeStyle;strokeColor=#000000;endArrow=NONE");
                    else
                        var x1 = this.graph.insertEdge(this.graph.getDefaultParent(), null, '', selection[0].children[0], selection[1].children[0], "edgeStyle=orthogonalEdgeStyle;strokeColor=#000000;endArrow=NONE");
                }    
            }
            finally {
                // Updates the display
                this.graph.getModel().endUpdate();
            }         
        }
    }

    private reverseEdge() : void {
        if (this.graph.getSelectionCount() == 1) {
            let selection = this.graph.getSelectionCells();
            if (selection[0].isEdge()) {
                this.graph.getModel().beginUpdate();
                try {
                    var originalSourceTerminal = selection[0].getTerminal(true);
                    var originalTargetTerminal = selection[0].getTerminal(false);
                    selection[0].setTerminal(originalSourceTerminal, false);
                    selection[0].setTerminal(originalTargetTerminal, true);

                    this.redrawCell(selection[0]);
                }
                finally {
                    // Updates the display
                    this.graph.getModel().endUpdate();
                }
            } 
        }
    }

    private changeEdge(): void {
        if (this.graph.getSelectionCount() == 1) {
            let selection = this.graph.getSelectionCells();
            if (selection[0].isEdge()) {
                this.graph.getModel().beginUpdate();
                try {
                    if (selection[0].getStyle() == "edgeStyle=orthogonalEdgeStyle;strokeColor=#000000;") {
                        selection[0].setStyle("endArrow=none;edgeStyle=orthogonalEdgeStyle;strokeColor=#000000;");
                    }
                    else {
                        selection[0].setStyle("edgeStyle=orthogonalEdgeStyle;strokeColor=#000000;");
                    }
                    this.redrawCell(selection[0]);
                }
                finally {
                    // Updates the display
                    this.graph.getModel().endUpdate();
                }
            } 
        }
    }

    private customResize() : void {
        // Enables managing of sizers
        mx.mxVertexHandler.prototype.manageSizers = true;
        
        // // Enables live preview
        mx.mxVertexHandler.prototype.livePreview = true;

        // Rounded edge and vertex handles
        var touchHandle = new mx.mxImage('/assets/mxgraph/images/handle-main.png', 10, 10);
        mx.mxVertexHandler.prototype.handleImage = touchHandle;
        mx.mxEdgeHandler.prototype.handleImage = touchHandle;
        mx.mxOutline.prototype.sizerImage = touchHandle;
        
        // // Pre-fetches touch handle
        new Image().src = touchHandle.src;
    }
        
    private customAnchors() : void {
		// // Overridden to define per-shape connection points
		// mx.mxGraph.prototype.getAllConnectionConstraints = function(terminal, source)
		// {
        //     return terminal.shape.constraints;
        // };
		// // Defines the default constraints for all shapes
		// mx.mxFactShape.prototype.constraints = [new mx.mxConnectionConstraint(new mx.mxPoint(0.25, 0), true),
        //                                     new mx.mxConnectionConstraint(new mx.mxPoint(0.5, 0), true),
        //                                     new mx.mxConnectionConstraint(new mx.mxPoint(0.75, 0), true),
        //                                     new mx.mxConnectionConstraint(new mx.mxPoint(0, 0.25), true),
        //                                     new mx.mxConnectionConstraint(new mx.mxPoint(0, 0.5), true),
        //                                     new mx.mxConnectionConstraint(new mx.mxPoint(0, 0.75), true),
        //                                     new mx.mxConnectionConstraint(new mx.mxPoint(1, 0.25), true),
        //                                     new mx.mxConnectionConstraint(new mx.mxPoint(1, 0.5), true),
        //                                     new mx.mxConnectionConstraint(new mx.mxPoint(1, 0.75), true),
        //                                     new mx.mxConnectionConstraint(new mx.mxPoint(0.25, 1), true),
        //                                     new mx.mxConnectionConstraint(new mx.mxPoint(0.5, 1), true),
        //                                     new mx.mxConnectionConstraint(new mx.mxPoint(0.75, 1), true)];
        // mx.mxPolyline.prototype.constraints = null; 
        
		/**
		 * Overrides method to provide connection constraints for shapes.
		 */
		mx.mxGraph.prototype.getAllConnectionConstraints = function(terminal, source)
		{
			if (terminal != null)
			{
				var constraints = mx.mxUtils.getValue(terminal.style, 'points', null);
				
				if (constraints != null)
				{
					// Requires an array of arrays with x, y (0..1), an optional
					// [perimeter (0 or 1), dx, and dy] eg. points=[[0,0,1,-10,10],[0,1,0],[1,1]]
					var result = [];
					
					try
					{
						var c = JSON.parse(constraints);
						
						for (var i = 0; i < c.length; i++)
						{
							var tmp = c[i];
							result.push(new mx.mxConnectionConstraint(new mx.mxPoint(tmp[0], tmp[1]), (tmp.length > 2) ? tmp[2] != '0' : true,
									null, (tmp.length > 3) ? tmp[3] : 0, (tmp.length > 4) ? tmp[4] : 0));
						}
					}
					catch (e)
					{
						// ignore
					}
					
					return result;
				}
				else if (terminal.shape != null)
				{
					var dir = terminal.shape.direction;
					var bounds = terminal.shape.bounds;
					var scale = terminal.shape.scale;
					var w = bounds.width / scale, h = bounds.height / scale;
					
					if (dir == mx.mxConstants.DIRECTION_NORTH || dir == mx.mxConstants.DIRECTION_SOUTH)
					{
						var tmp2 = w;
						w = h;
						h = tmp2;
					}
					
					constraints = terminal.shape.getConstraints(terminal.style, w, h);
					
					if (constraints != null)
					{
						return constraints;
					}
					else if (terminal.shape.stencil != null && terminal.shape.stencil.constraints != null)
					{
						return terminal.shape.stencil.constraints;
					}
					else if (terminal.shape.constraints != null)
					{
						return terminal.shape.constraints;
					}
				}
			}
		
			return null;
		};
    }

    private customGuides() : void {
        mx.mxGraphHandler.prototype.guidesEnabled = true;
        mx.mxEdgeHandler.prototype.snapToTerminals = true;
        mx.mxGraphHandler.prototype.useGuidesForEvent = function(me)
        {
            return !mx.mxEvent.isAltDown(me.getEvent());
        };
        mx.mxConstants.GUIDE_COLOR = ModelerConstants.STYLE_SELECTED_HIGHLIGHT;
        mx.mxConstants.GUIDE_STROKEWIDTH = 1;
    }

    // // Edit edge according to target
    // private customEdgeUpdater() : void {
    //     this.graph.getView().updateStyle = true;

    //     var previous = this.graph.model.getStyle;
				
    //     this.graph.model.getStyle = function(cell)
    //     {
    //         if (cell != null)
    //         {
    //             var style = previous.apply(this, arguments);
                
    //             if (this.isEdge(cell))
    //             {
    //                 var target = this.getTerminal(cell, false);
    
    //                 if (target != null)
    //                 {
    //                     var state = this.graph.getView().getState(target);
    //                     var targetStyle = (state != null) ? state.style : this.graph.getCellStyle(target);
    //                     var fill = mx.mxUtils.getValue(targetStyle, mx.mxConstants.STYLE_FILLCOLOR);
                
    //                     if (fill != null)
    //                     {
    //                         style += ';strokeColor='+fill;
    //                     }
    //                 }
    //             }
    //             else if (this.isVertex(cell))
    //             {
    //                 var geometry = this.getGeometry(cell);
                    
    //                 if (geometry != null && geometry.width > 80)
    //                 {
    //                     style += ';fillColor=green';
    //                 }
    //             }
    //             return style;
    //         }
    //         return null;
    //     };
    // }

    redrawCell(cell: mxgraph.mxCell) : void {
        this.graph.view.clear(cell, false, false);
        this.graph.view.validate();
    }

    setupDynamicToolbarOfd(): void {
		document.getElementById("toolbar-action-undo").addEventListener("click", () => {
            this.editor.undo();
        });
        
		document.getElementById("toolbar-action-redo").addEventListener("click", () => {
            this.editor.redo();
        });

		document.getElementById("toolbar-action-delete").addEventListener("click", () => {
            this.graph.removeCells(this.graph.getSelectionCells());
        });

        document.getElementById("toolbar-action-fact").addEventListener("click", () => {
            this.addFact();
        });

        document.getElementById("toolbar-action-external-fact").addEventListener("click", () => {
            this.addExternalFact();
        });

        document.getElementById("toolbar-action-product").addEventListener("click", () => {
            this.addProduct();
        });

        document.getElementById("toolbar-action-edge").addEventListener("click", () => {
            this.addEdge();
        });

        document.getElementById("toolbar-action-reverse-edge").addEventListener("click", () => {
            this.reverseEdge();
        });

        document.getElementById("toolbar-action-change-edge").addEventListener("click", () => {
            this.changeEdge();
        });
    }

    public destroy(): void {
        this.graph.destroy();
    }
}
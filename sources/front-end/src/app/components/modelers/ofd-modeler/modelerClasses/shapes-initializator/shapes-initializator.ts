import MxGraphFactory, { mxgraph } from "mxgraph";
import { FatalError } from "../../../../../directives/utils/exceptions";
// import { ModelerConstants } from '../defines-constants';
// import { ShapesInit } from '../shapes-init';
// import { StateManagerService } from 'src/app/services/state-management/state-manager.service';

// Prepare MxGraph
// const mx = require('mxgraph')({
//     mxImageBasePath: '/assets/mxgraph/images',
//     mxBasePath: '/assets/mxgraph'
// });

export class ShapesInit {
    constructor(mx) 
    {
        this.AddProductShape(mx);
        this.AddFactShape(mx);
    }

    private AddProductShape(mx): void
    {
        function mxProductShape()
        {
            mx.mxRectangleShape.call(this);
        };
        
        mx.mxUtils.extend(mxProductShape, mx.mxRectangleShape);
        
        mxProductShape.prototype.size = 0.1;
        // mxProductShape.prototype.isHtmlAllowed = function()
        // {
        //     return true;
        // };

        mxProductShape.prototype.getLabelBounds = function(rect)
        {
            if (mx.mxUtils.getValue(this.state.style, mx.mxConstants.STYLE_HORIZONTAL, true) ==
                (this.direction == null ||
                this.direction == mx.mxConstants.DIRECTION_EAST ||
                this.direction == mx.mxConstants.DIRECTION_WEST))
            {
                var w = rect.width;
                var h = rect.height;
                var r = new mx.mxRectangle(rect.x, rect.y, w, h);
        
                var inset = w * Math.max(0, Math.min(1, parseFloat(mx.mxUtils.getValue(this.style, 'size', this.size))));
        
                if (this.isRounded)
                {
                    var f = mx.mxUtils.getValue(this.style, mx.mxConstants.STYLE_ARCSIZE,
                        mx.mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;
                    inset = Math.max(inset, Math.min(w * f, h * f));
                }
                
                r.x += Math.round(inset);
                r.width -= Math.round(2 * inset);
                
                return r;
            }
            
            return rect;
        };

        mxProductShape.prototype.paintForeground = function(c, x, y, w, h)
        {
            var inset = w * Math.max(0, Math.min(1, parseFloat(mx.mxUtils.getValue(this.style, 'size', this.size))));
        
            if (this.isRounded)
            {
                var f = mx.mxUtils.getValue(this.style, mx.mxConstants.STYLE_ARCSIZE,
                    mx.mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;
                inset = Math.max(inset, Math.min(w * f, h * f));
                inset = 0.7 * inset;
            }
            
            // Crisp rendering of inner lines
            inset = Math.round(inset);
            
            c.begin();
            c.setDashed(true);
            c.moveTo(x, y + inset);
            c.lineTo(x + w, y + inset);
            c.moveTo(x, y + h - inset);
            c.lineTo(x + w, y + h - inset);
            c.end();
            c.stroke();
            // c.begin();
            // c.setDashed(false);
            // c.setStrokeColor('#ff0000'); 
            // c.moveTo(x + w / 2, y + inset + 20);
            // c.lineTo(x + w / 2 - 25, y + inset + 45);
            // c.lineTo(x + w / 2, y + inset + 70);
            // c.lineTo(x + w / 2 + 25, y + inset + 45);
            // c.lineTo(x + w / 2, y + inset + 20);
            // c.end();
            // c.stroke();
            mx.mxRectangleShape.prototype.paintForeground.apply(this, arguments);
        };
        
        mx.mxCellRenderer.registerShape('product', mxProductShape);

        mxProductShape.prototype.getConstraints = function(style, w, h)
        {
            var inset = w * Math.max(0, Math.min(1, parseFloat(mx.mxUtils.getValue(this.style, 'size', this.size))));
        
            if (this.isRounded)
            {
                var f = mx.mxUtils.getValue(this.style, mx.mxConstants.STYLE_ARCSIZE,
                    mx.mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;
                inset = Math.max(inset, Math.min(w * f, h * f));
                inset = 0.7 * inset;
            }
            
            inset = Math.round(inset);
            
            var constr = [];
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0.5, 0), false, null, 0, inset + 20));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0.5, 0), false, null, -25, inset + 45));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0.5, 0), false, null, 0, inset + 70));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0.5, 0), false, null, 25, inset + 45));
    
            return (constr);
        };
    } 

    private AddFactShape(mx): void
    {
        
        function mxFactShape()
        {
            mx.mxRectangleShape.call(this);
        };
        
        mx.mxUtils.extend(mxFactShape, mx.mxRectangleShape);
        
        mxFactShape.prototype.size = 0.1;
        mxFactShape.prototype.isHtmlAllowed = function()
        {
            return false;
        };
        mxFactShape.prototype.getLabelBounds = function(rect)
        {
            if (mx.mxUtils.getValue(this.state.style, mx.mxConstants.STYLE_HORIZONTAL, true) ==
                (this.direction == null ||
                this.direction == mx.mxConstants.DIRECTION_EAST ||
                this.direction == mx.mxConstants.DIRECTION_WEST))
            {
                var w = rect.width;
                var h = rect.height;
                var r = new mx.mxRectangle(rect.x, rect.y, w, h);
        
                var inset = w * Math.max(0, Math.min(1, parseFloat(mx.mxUtils.getValue(this.style, 'size', this.size))));
        
                if (this.isRounded)
                {
                    var f = mx.mxUtils.getValue(this.style, mx.mxConstants.STYLE_ARCSIZE,
                        mx.mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;
                    inset = Math.max(inset, Math.min(w * f, h * f));
                }
                
                r.x += Math.round(inset);
                r.width -= Math.round(2 * inset);
                
                return r;
            }
            
            return rect;
            // 	// Overridden to define per-shape connection points
            // 	mx.mxGraph.prototype.getAllConnectionConstraints = function(terminal, source)
            // 	{
            //         return terminal.shape.constraints;
            //     };
            // 	// Defines the default constraints for all shapes
            // 	mx.mxShape.prototype.constraints = [   new mx.mxConnectionConstraint(new mx.mxPoint(0.25, 0), true),
            //                                         new mx.mxConnectionConstraint(new mx.mxPoint(0.5, 0), true),
            //                                         new mx.mxConnectionConstraint(new mx.mxPoint(0.75, 0), true),
            //                                         new mx.mxConnectionConstraint(new mx.mxPoint(0, 0.25), true),
            //                                         new mx.mxConnectionConstraint(new mx.mxPoint(0, 0.5), true),
            //                                         new mx.mxConnectionConstraint(new mx.mxPoint(0, 0.75), true),
            //                                         new mx.mxConnectionConstraint(new mx.mxPoint(1, 0.25), true),
            //                                         new mx.mxConnectionConstraint(new mx.mxPoint(1, 0.5), true),
            //                                         new mx.mxConnectionConstraint(new mx.mxPoint(1, 0.75), true),
            //                                         new mx.mxConnectionConstraint(new mx.mxPoint(0.25, 1), true),
            //                                         new mx.mxConnectionConstraint(new mx.mxPoint(0.5, 1), true),
            //                                         new mx.mxConnectionConstraint(new mx.mxPoint(0.75, 1), true)];
            //     mx.mxPolyline.prototype.constraints = null; 
        };

        mxFactShape.prototype.paintForeground = function(c, x, y, w, h)
        {
            var inset = w * Math.max(0, Math.min(1, parseFloat(mx.mxUtils.getValue(this.style, 'size', this.size))));
        
            if (this.isRounded)
            {
                var f = mx.mxUtils.getValue(this.style, mx.mxConstants.STYLE_ARCSIZE,
                    mx.mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) / 100;
                inset = Math.max(inset, Math.min(w * f, h * f));
            }
            
            // Crisp rendering of inner lines
            inset = Math.round(inset);
            
            c.begin();
            c.setDashed(true);
            c.moveTo(x, y + inset);
            c.lineTo(x + w , y + inset);
            c.end();
            c.stroke();
            mx.mxRectangleShape.prototype.paintForeground.apply(this, arguments);
        };
        
        mx.mxCellRenderer.registerShape('fact', mxFactShape);
        
        mxFactShape.prototype.getConstraints = function(style, w, h)
        {            
            var constr = [];
            
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0.25, 0), true));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0.5, 0), true));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0.75, 0), true));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0, 0.25), true));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0, 0.5), true));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0, 0.75), true));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(1, 0.25), true));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(1, 0.5), true));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(1, 0.75), true));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0.25, 1), true));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0.5, 1), true));
            constr.push(new mx.mxConnectionConstraint(new mx.mxPoint(0.75, 1), true));
    
            return (constr);
        };
    }
    
}
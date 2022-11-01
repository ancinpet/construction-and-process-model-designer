import inherits from 'inherits';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import SP from '../sp';

import {
  append as svgAppend,
  create as svgCreate
} from 'tiny-svg';


export default function SPRender(eventBus) {
  BaseRenderer.call(this, eventBus, 1500);

  this.canRender = function(element) {
    return is(element, 'bpmn:ServiceTask');
  };


  this.drawShape = function(parent, shape) {
    var url = SP.dataURL;

    var spGfx = svgCreate('image', {
      x: 0,
      y: 0,
      width: shape.width,
      height: shape.height,
      href: url
    });

    svgAppend(parent, spGfx);

    return spGfx;
  };
}

inherits(SPRender, BaseRenderer);

SPRender.$inject = [ 'eventBus' ];

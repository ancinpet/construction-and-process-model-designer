import inherits from 'inherits';
import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';
import processProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps';
import eventProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps';
import linkProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps';
import documentationProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps';
import idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';
import nameProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';
import { TaskProps } from '../props/TaskProps.js';
import { createGeneralTabGroups } from './f1.js';
import { createMagicTabGroups } from './f2.js';
import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

export function getFunction(stateManager) {
  
  return function (eventBus, bpmnFactory, elementRegistry, translate) {
    PropertiesActivator.call(this, eventBus);
    this.getTabs = function (element) {
      var generalTab = {
        id: 'general',
        label: 'General',
        groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate)
      };

      var magicTab = {
        id: 'Psi',
        label: 'PSI properties',
        groups: createMagicTabGroups(element, elementRegistry, stateManager)
      };

      return [
        generalTab,
        magicTab
      ];
    };
  }
}

/*
function createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate) {
  var generalGroup = {
    id: 'general',
    label: 'General',
    entries: []
  };
  idProps(generalGroup, element, translate);
  nameProps(generalGroup, element, translate);
  processProps(generalGroup, element, translate);

  var detailsGroup = {
    id: 'details',
    label: 'Details',
    entries: []
  };
  linkProps(detailsGroup, element, translate);
  eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);

  var documentationGroup = {
    id: 'documentation',
    label: 'Documentation',
    entries: []
  };

  documentationProps(documentationGroup, element, bpmnFactory, translate);

  return[
    generalGroup,
    detailsGroup,
    documentationGroup
  ];
}
*/
/*
function createMagicTabGroups(element, elementRegistry, stateManager) {

  // Create a group called "Black Magic".
  var blackMagicGroup = {
    id: 'black-magic',
    label: 'PSI properties',
    entries: []
  };

  TaskProps(blackMagicGroup, element, stateManager);

  return [
    blackMagicGroup
  ];
}
*/
//inherits(TaskPropertiesProvider, PropertiesActivator);

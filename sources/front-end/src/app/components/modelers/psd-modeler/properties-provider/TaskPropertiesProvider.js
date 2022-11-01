import inherits from 'inherits';
import * as PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';
import * as processProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps';
import * as eventProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps';
import * as linkProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps';
import * as documentationProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps';
import * as idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';
import * as nameProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';
import { StateManagerService } from 'src/app/services/state-management/state-manager.service';
import { globalVariables } from './globals';

import TaskProps from './props/TaskProps';

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

function createMagicTabGroups(element, elementRegistry) { //,state

  var blackMagicGroup = {
    id: 'black-magic',
    label: 'PSI properties',
    entries: []
  };

  TaskProps(blackMagicGroup, element, globalVariables[0]); //, state
  return [
    blackMagicGroup
  ];
}

export default function TaskPropertiesProvider(
    eventBus, bpmnFactory, elementRegistry,
  translate) {
  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: 'General',
      groups: createGeneralTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    var magicTab = {
      id: 'Psi',
      label: 'PSI properties',
      groups: createMagicTabGroups(element, elementRegistry)
    };

    return [
      generalTab,
      magicTab
    ];
  };
}

TaskPropertiesProvider.$inject = ['eventBus', 'bpmnFactory', 'elementRegistry', 'translate'];
inherits(TaskPropertiesProvider, PropertiesActivator);



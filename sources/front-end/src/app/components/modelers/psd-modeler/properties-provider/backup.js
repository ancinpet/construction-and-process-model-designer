import inherits from 'inherits';

import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';

// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
import processProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps';
import eventProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps';
import linkProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps';
import documentationProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps';
import idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';
import nameProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';


// Require your custom property entries.
import TaskProps from './parts/TaskProps';


// The general tab contains all bpmn relevant properties.
// The properties are organized in groups.
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

// Create the custom magic tab
function createMagicTabGroups(element, elementRegistry) {

  // Create a group called "Black Magic".
  var blackMagicGroup = {
    id: 'black-magic',
    label: 'PSI properties',
    entries: []
  };

  // Add the spell props to the black magic group.
  TaskProps(blackMagicGroup, element);

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

    // The "magic" tab
    var magicTab = {
      id: 'psi',
      label: 'PSI properties',
      groups: createMagicTabGroups(element, elementRegistry)
    };

    // Show general + "magic" tab
    return [
      generalTab,
      magicTab
    ];
  };
}

inherits(TaskPropertiesProvider, PropertiesActivator);

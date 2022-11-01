import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import { Subscriber, Subscription, BehaviorSubject } from "rxjs";
import { StateManagerService, PsiContractEditorState} from 'src/app/services/state-management/state-manager.service';
import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

export default function TaskProps(group, element) {
 
  if (is(element, 'bpmn:Task')) {
    group.entries.push(entryFactory.selectBox({
      id: 'TransactionKindType',
      label: 'Type',
      selectOptions: [{ name: 'Requested', value: 'rq' }, { name: 'Promised', value: 'pr' }, { name: 'Declined', value: 'dc' }],
      modelProperty: 'TransactionType'
    }));

    group.entries.push(entryFactory.selectBox({
      id: 'TransactionKindID',
      label: 'Transaction Kind',
      selectOptions: [{ name: 'T-1', value: 1 }, { name: 'T-2', value: 2 }, { name: 'T-3', value: 3 }],
      modelProperty: 'TransactionID'
    }));
  }
  
  if (is(element, 'bpmn:Participant')) {
    group.entries.push(entryFactory.selectBox({
      id: 'ActorID',
      label: 'Actor',
      selectOptions: [{ name: 'A-1', value: 1 }, { name: 'A-2', value: 2 }, { name: 'A-3', value: 3 }],
      modelProperty: 'Actor'
    }));
  }
  
  if (is(element, 'bpmn:Lane')) {
    group.entries.push(entryFactory.selectBox({
      id: 'ActorID',
      label: 'Actor',
      selectOptions: [{ name: 'A-1', value: 1 }, { name: 'A-2', value: 2 }, { name: 'A-3', value: 3 }],
      modelProperty: 'Actor'
    }));
  }
}

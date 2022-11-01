import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import { Subscriber, Subscription, BehaviorSubject } from "rxjs";
import { StateManagerService, PsiContractEditorState} from 'src/app/services/state-management/state-manager.service';
import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

export default function TaskProps(group, element, stateManager) {
  var b;
  var a = stateManager.getState$().subscribe((state) => { b = state; });
  var tk = b.psiContract.transactionKinds;
  var ac = b.psiContract.actorRoles;

  var restk = [];
  var resac = [];
  for (var i = 0; i < tk.length; i++) {
    restk.push({ name: tk[i].name, value: tk[i].name });
  }

  for (var i = 0; i < ac.length; i++) {
    resac.push({ name: ac[i].name, value: ac[i].name });
  }

  if (is(element, 'bpmn:Task')) {
    group.entries.push(entryFactory.selectBox({
      id: 'TransactionKindID',
      label: 'Transaction Kind',
      //selectOptions: [{ name: 'T-1', value: 1 }, { name: 'T-2', value: 2 }, { name: 'T-3', value: 3 }],
      selectOptions: restk,
      modelProperty: 'name'
    }));

    group.entries.push(entryFactory.selectBox({
      id: 'TransactionKindType',
      label: 'Transaction Type',
      //selectOptions: [{ name: 'T-1', value: 1 }, { name: 'T-2', value: 2 }, { name: 'T-3', value: 3 }],
      selectOptions: [{ name: 'Request', value: 'rq' }, { name: 'Promise', value: 'pm' }, {name: 'Decline', value: 'dc'}],
      modelProperty: 'type'
    }));
  }

  if (is(element, 'bpmn:Lane')) {
    group.entries.push(entryFactory.selectBox({
      id: 'ActorID',
      label: 'Actor',
      //selectOptions: [{ name: 'A-1', value: 1 }, { name: 'A-2', value: 2 }, { name: 'A-3', value: 3 }],
      selectOptions: resac,
      modelProperty: 'name'
    }));
  }
}

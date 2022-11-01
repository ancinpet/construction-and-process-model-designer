import { Component, OnInit, ViewChild, ElementRef, Injectable } from '@angular/core';
import { StateManagerService, ActionType, IAction, PsiContractEditorState } from 'src/app/services/state-management/state-manager.service';
import { Subscriber, Subscription, BehaviorSubject } from "rxjs";
import { Store, Action } from '@ngrx/store';
import { PsiContract } from "src/app/model/model";

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import {
  is
} from 'bpmn-js/lib/util/ModelUtil';



export class TaskProps {
  private stateManager: StateManagerService;
  private propertiesSubscription: Subscription;
  private state: PsiContractEditorState;

  constructor(stateManager: StateManagerService) {
    this.stateManager = stateManager;
  }

  update(group, element) {
    this.propertiesSubscription = this.stateManager.getState$().subscribe((state: PsiContractEditorState) => { this.state = state; });
    var contract = this.state.psiContract;

    if (is(element, 'bpmn:Task')) {
      var tk = contract.transactionKinds;
      var res = [];
      for (var i = 0; i < tk.length; i++) res.push({ name: tk[i].name, value: tk[i].id });
      group.entries.push(entryFactory.selectBox({
        id: 'TransactionKindID',
        label: 'Transaction Kind',
        selectOptions: res,
        modelProperty: 'TransactionKind'
      }));
    }

    if (is(element, 'bpmn:Participant')) {
      var ac = contract.actorRoles;
      var res = [];
      for (var i = 0; i < ac.length; i++) res.push({ name: ac[i].name, value: ac[i].id });
      group.entries.push(entryFactory.selectBox({
        id: 'ActorID',
        label: 'Actor',
        selectOptions: res,
        modelProperty: 'Actor'
      }));
    }
  }
}

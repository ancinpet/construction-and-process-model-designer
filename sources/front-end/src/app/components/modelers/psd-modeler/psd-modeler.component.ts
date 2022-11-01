import { Component, OnInit, ViewChild, ElementRef, Injectable } from '@angular/core';
import { StateManagerService, ActionType, IAction} from 'src/app/services/state-management/state-manager.service';
import { Subscriber, Subscription, BehaviorSubject } from "rxjs";
import { Store, Action } from '@ngrx/store';
import { PsiContract } from "src/app/model/model";
import { BpmnModel } from "./modeler/modeler";
import { ActivatedRoute, Router} from '@angular/router';
import inherits from 'inherits';
import * as PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';
import * as BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import { getActorRole, getTransactionKind, getProcess, isEelentaryTransactor, isSelfActivatingTransactor, hasChildren } from 'src/app/model/utils';
import { globalVariables } from './properties-provider/globals';
import * as propertiesPanelModule from 'bpmn-js-properties-panel';
import taskPropertiesProvider from './properties-provider';
import * as AMActions from 'src/app/services/state-management/actions'
import * as ModelUtils from '../../../model/utils';
import { Guid } from 'guid-typescript';
import defaultPaletteProvider from './palette-provider';
import {collectExternalReferences} from '@angular/compiler';

@Component({
  selector: 'app-psd-modeler',
  templateUrl: './psd-modeler.component.html',
  styleUrls: ['./psd-modeler.component.scss'],
  //providers: [ StateManagerService ]
})



export class PsdModelerComponent implements OnInit {
  private bpmnModeler: BpmnModeler;
  private process_id;
  private diagram_id;
  private model: BpmnModel;
  private stateManager: StateManagerService;
  private activatedRoute: StateManagerService;
  private propertiesSubscription: Subscription;
  private router;

  constructor(activatedroute: ActivatedRoute, stateManager: StateManagerService, router: Router) {
    globalVariables[0] = stateManager;
    this.bpmnModeler = new BpmnModeler({
      additionalModules: [
        defaultPaletteProvider,
        propertiesPanelModule,
        taskPropertiesProvider
      ]
    });

    this.router = router;
    this.stateManager = stateManager;
    this.activatedRoute = this.activatedRoute;
    this.model = new BpmnModel(this.stateManager);
    activatedroute.params.subscribe(params => { this.process_id = params['id1']; this.diagram_id = params['id2']; this.draw(); });
  }


  ngOnInit(): void {
    this.bpmnModeler.attachTo('#bpmn-canvas');
    var propertiesPanel = this.bpmnModeler.get('propertiesPanel');
    propertiesPanel.attachTo('#bpmn-properties');
  }

  draw() {
    var b;
    this.stateManager.getState$().subscribe((state) => { b = state; });
    let psiContract = b.psiContract;
    var process = ModelUtils.getProcess(psiContract, this.process_id);
    let xml = ModelUtils.getBpmnDiagram(process, this.diagram_id);

    this.bpmnModeler.importXML(xml, function (error) { if (error) { return console.log('could not import bpmn diagram', error); } });
    var eventBus = this.bpmnModeler.get('eventBus');
    var events = [
      'element.dblclick',
      'element.hover'
    ];
    var thisl = this;
    events.forEach((event) => {
      eventBus.on(event, function (e) {
        thisl.bpmnModeler.saveXML({ format: true }, function (err, xml) {
          let action = new AMActions.UpdateBpmnDiagramAction(thisl.process_id, thisl.diagram_id, xml);
          thisl.stateManager.dispatchAction(action);
        });

        if (e.element.type == 'bpmn:ScriptTask' && event == 'element.dblclick') {
              var modeling = thisl.bpmnModeler.get('modeling');
              var elementRegistry = thisl.bpmnModeler.get('elementRegistry');
              var sequenceFlowElement = elementRegistry.get(e.element.id),
              sequenceFlow = sequenceFlowElement.businessObject;
  
              if (sequenceFlow.name == undefined) {
              var id = Guid.create();
              let action = new AMActions.AddActionRule(id, "ActionRule", "");
              thisl.stateManager.dispatchAction(action);

                modeling.updateProperties(sequenceFlowElement, {
                name: id
              });

            } else {
                thisl.router.navigate(['/modelerAmd/' + sequenceFlow.name]);
            }
          console.log("Script task: doubleclick. Openinig AMD");
        }
      });
    });
  }
}












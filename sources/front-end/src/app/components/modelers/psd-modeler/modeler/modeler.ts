import { StateManagerService, PsiContractEditorState, IAction, ActionType} from 'src/app/services/state-management/state-manager.service';
import { Subscriber, Subscription, BehaviorSubject, generate } from 'rxjs';
import { MyString } from './MyString/MyString';
import { getActorRole, getTransactionKind, getProcess, isEelentaryTransactor, isSelfActivatingTransactor, hasChildren} from 'src/app/model/utils';

export class BpmnActor {
  public actor = undefined;
  public transactionKinds = [];

  constructor(actor) {
    this.actor = actor;
  }
}


export class BpmnModel {
    private id;
    private lol: MyString;
    private stateManager;
    private propertiesSubscription;
    constructor(stateManager) {
      this.stateManager = stateManager;
      this.lol = new MyString;
    }

  update(id) {
    this.id = id;
    this.lol.actors.length = 0;
    this.propertiesSubscription = this.stateManager.getState$().subscribe((state: PsiContractEditorState) => { this.collectData(state, this.lol, this.id); });
  }

  collectData(state, ms, process_id) {
    let psiContract = state.psiContract;
    var process = getProcess(psiContract, process_id);
    if (process == undefined || process == null) return;
    if (process.root == undefined || process.root == null) return;

    this.recursion(process.root, ms, psiContract);
    this.generateXML(ms, psiContract);
  }

  recursion(transactor, ms, contract) {
    if (transactor == undefined || transactor == null) return;
    if (isEelentaryTransactor(transactor) || isSelfActivatingTransactor(transactor)) {
      var tk = getTransactionKind(contract, transactor.transactionKind);
      var ac = getActorRole(contract, tk.executor);
 
      if (hasChildren(transactor)) {
        transactor.children.map((child) => this.recursion(child, ms, contract));
      }

      var result = ms.actors.find((actor) => actor.actor == ac);
      if (result == undefined) {
        var bac = new BpmnActor(ac);
        bac.transactionKinds.push(tk);
        ms.actors.push(bac);
      } else {
        result.transactionKinds.push(tk);
      }
    } else {
      var ac = getActorRole(contract, transactor.actorRole);
      if (hasChildren(transactor)) {
        transactor.children.map((child) => this.recursion(child, ms, contract));
      }

      var result = ms.actors.find((actor) => actor.actor == ac);
      if (result == undefined) {
        var bac = new BpmnActor(ac);
        ms.actors.push(bac);
      }
    }
  }


  generateXML(ms, ct): void {
    let xml = '';
    xml += '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_1i9jvwj" targetNamespace="http://bpmn.io/schema/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="3.3.1">\n';
    console.log("XML = " + xml);
    xml += '<bpmn:collaboration id="Collaboration">\n';
    for (var i = 0; i < ms.actors.length; i++) {
      xml += '<bpmn:participant id="Participant_' + ms.actors[i].actor.id + '" name="' + ms.actors[i].actor.name + '" processRef="Process_' + ms.actors[i].actor.id + '" />\n';
      /*
      for (var j = 0; j < ms.actors[i].transactionKinds.length; j++) {
        if (i < ms.actors.length - 1) {
          xml += '<bpmn:messageFlow id="MessageFlow_' + ms.actors[i].transactionKinds[j].id + ms.actors[i+1].transactionKinds[0].id + '" sourceRef="Task_' + ms.actors[i].transactionKinds[j].id + '" targetRef="Task_' + ms.actors[i+1].transactionKinds[0].id + '" />\n';
        }
      }
      */
    }

      xml += '</bpmn:collaboration>\n';

    for (var i = 0; i < ms.actors.length; i++) {
      xml += '<bpmn:process id="Process_' + ms.actors[i].actor.id + '" isExecutable="true">\n';
      if (i == ms.actors.length - 1) {
        xml += '<bpmn:startEvent id="StartEvent_' + ms.actors[i].actor.id + '" />\n';
      }

      if (i == 0) {
        xml += '<bpmn:endEvent id="EndEvent_' + ms.actors[i].actor.id + '" />'
      }
      for (var j = 0; j < ms.actors[i].transactionKinds.length; j++) {
        xml += '<bpmn:task id="Task_' + ms.actors[i].transactionKinds[j].id + '" name="' + ms.actors[i].transactionKinds[j].name + '" />\n';
      }
      xml += '</bpmn:process>\n';
    }


    xml += '<bpmndi:BPMNDiagram id="BPMNDiagram">\n' +
      '    <bpmndi:BPMNPlane id="BPMNPlane" bpmnElement="Collaboration">\n';

    for (var i = 0; i < ms.actors.length; i++) {
      xml += '<bpmndi:BPMNShape id="Participant_' + ms.actors[i].actor.id + '_di" bpmnElement="Participant_' + ms.actors[i].actor.id + '" isHorizontal="true">\n' +
        '<dc:Bounds x="150" y="' + (160 * i + 100) + '" width="600" height="150" />\n' +
        '</bpmndi:BPMNShape>\n';
      if (i == ms.actors.length - 1) {
        xml += '<bpmndi:BPMNShape id="StartEvent_' + ms.actors[i].actor.id + '_di" bpmnElement="StartEvent_' + ms.actors[i].actor.id + '">\n' +
          '<dc:Bounds x="225" y="' + (160 * i + 110) + '" width="36" height="36" />\n' +
          '</bpmndi:BPMNShape>\n';
      }

      if (i == 0) {
        xml += '<bpmndi:BPMNShape id="EndEvent_' + ms.actors[i].actor.id + '_di" bpmnElement="EndEvent_' + ms.actors[i].actor.id + '">\n' +
          '<dc:Bounds x="560" y="' + (160 * i + 110) + '" width="36" height="36" />\n' +
          '</bpmndi:BPMNShape>\n';
      }

      for (var j = 0; j < ms.actors[i].transactionKinds.length; j++) {
        xml += ' <bpmndi:BPMNShape id="Task_' + ms.actors[i].transactionKinds[j].id + '_di" bpmnElement="Task_' + ms.actors[i].transactionKinds[j].id + '">\n' +
          '<dc:Bounds x="' + (275 + 110 * j) + '" y="' + (160 * i + 110) + '" width="100" height="80" />\n' +
          '</bpmndi:BPMNShape>\n';
        /*
        if (i < ms.actors.length - 1) {
          xml += '<bpmndi:BPMNEdge id="MessageFlow_' + ms.actors[i].transactionKinds[j].id + ms.actors[i+1].transactionKinds[0].id + '_di" bpmnElement="MessageFlow_' + ms.actors[i].transactionKinds[j].id + ms.actors[i+1].transactionKinds[0].id + '">\n' +
            '<di:waypoint x="' + (200 + 110 * j + 50) + '" y="' + (160 * i + 110 + 80) + '" />\n' +
            '<di:waypoint x="' + (200 + 110 * j + 50) + '" y="' + (160 * (i + 1) + 110) + '" />\n' +
            '</bpmndi:BPMNEdge>\n';
        }
        */
      }
    }

    xml += '    </bpmndi:BPMNPlane>\n' +
           '</bpmndi:BPMNDiagram>\n' +
      '</bpmn:definitions>\n';
    console.log("XML = " + xml);
    ms.xml = xml;
  }

  getText() {
      return this.lol.xml;
    }
}

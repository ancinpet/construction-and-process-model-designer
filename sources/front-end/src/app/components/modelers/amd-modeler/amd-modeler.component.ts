import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { registerWhen } from "./modelerClasses/when";
import { registerAccess } from "./modelerClasses/access";
import { registerRule } from "./modelerClasses/rule";
import { StateManagerService, IAction, ActionType } from "../../../services/state-management/state-manager.service"
import { registerWith } from "./modelerClasses/with";
import { EventEmitter, Input, Output } from '@angular/core';
import { registerIf } from './modelerClasses/if';
import { registerAction } from './modelerClasses/action';
import { TransactionKind, PsiContract, IPsiContract, IWhenPart, IWhilePart, IWithPart, IIfPart, IThenPart, IElsePart, IAssign, IAct, IAmdAction, IStart } from 'src/app/model/model';
import { AddActionRule, UpdateActionRule, RemoveActionRule } from 'src/app/services/state-management/actions/am-actions';
import { Guid } from 'guid-typescript';
import { Subscription } from "rxjs";
import * as AMActions from '../../../services/state-management/actions'
import { Router } from '@angular/router';
import * as ModelUtils from '../../../model/utils';

declare var Blockly: any;
var customEmitter = new EventEmitter<any>();


@Component({
  selector: 'app-amd-modeler',
  templateUrl: './amd-modeler.component.html',
  styleUrls: ['./amd-modeler.component.scss']
})
export class AmdModelerComponent implements OnInit {
  private workspace: any;
  private id: Guid;
  private psiContract: PsiContract;
  private subscription: Subscription;
  public transactionKinds: Array<TransactionKind> = [];
  private toolbox: string =
    `<xml id="toolbox" style="display: none">
	
    <category name="Rule" colour="170">
		<block type="rule"></block>
	  </category>
    <category name="With" colour="170">
    
 <block type="dataField"></block>
    </category>

    <category name="If" colour="170">   

<block type="bool1"></block>
<block type="bool2"></block>
<block type="parentheses"></block>
<block type="not"></block>
<block type="and"></block>
<block type="or"></block>
    </category>
    <category name="Action" colour="170">
    <block type="action_assign"></block>
<block type="action_trans"></block>
<block type="param_helper"></block>

    </category>
    </xml>`;


  //dependency injection of state manager service - Tomas B
  constructor(protected stateManager: StateManagerService, private router: Router) {
    var splitted = router.url.split("/");
    this.id = Guid.parse(splitted[2]);
  }

  ngOnInit() {

    this.transactionKinds = new Array();
    this.subscription = this.stateManager.getPsiContract$()
      .subscribe((psiContract => this.OnUpdate(psiContract)), (error => this.OnError(error)), (() => this.OnComplete()));

    registerWhen();
    registerAccess();
    registerRule(this);
    registerWith();
    registerIf();
    registerAction();

    this.workspace = Blockly.inject('amdModelContainer', {
      toolbox: this.toolbox,
      horizontalLayout: true,
      scrollbars: false,
      sounds: false
    });
    this.LoadActionRule();
    this.OnChange = this.OnChange.bind(this);
    this.workspace.addChangeListener(this.OnChange);
  }
  initialize(psiContract: PsiContract) {
    for (let transaction of psiContract.transactionKinds) {
      this.transactionKinds.push(transaction);
    }
  }

  private OnUpdate(psiContract: PsiContract): void {
    this.psiContract = psiContract;
    this.initialize(psiContract);
  }

  private OnError(error) {
    console.log("Subscription error: %s", error);
  }

  private OnComplete() {
    console.log("Subscription end");
  }

  public CreateActionRule() {
    var xml = Blockly.Xml.workspaceToDom(this.workspace);
    var xml_text = Blockly.Xml.domToText(xml);
    this.id = Guid.create();
    let action = new AMActions.AddActionRule(this.id, "ActionRule", xml_text);
    this.stateManager.dispatchAction(action);
  }

  public LoadActionRule() {
    let actionRule = ModelUtils.getActionRule(this.psiContract, this.id);
    if (actionRule.ruleFormulation.length != 0) {
      let xml = Blockly.Xml.textToDom(actionRule.ruleFormulation);
      Blockly.Xml.domToWorkspace(xml, this.workspace);
    }
  }

  public OnChange(event) {
    if (event.type == Blockly.Events.UI) {
      return;
    }
    var xml = Blockly.Xml.workspaceToDom(this.workspace);
    var xml_text = Blockly.Xml.domToText(xml);
    //console.log(xml_text);

    let action = new AMActions.UpdateActionRule(this.id, "ActionRule", xml_text);
    this.stateManager.dispatchAction(action);
    //console.log(action);
  }

  public whenStateOptions(amdMod: AmdModelerComponent) {
    var options = [['Requested', 'RQ'], ['Promised', 'PM'], ['Declined', 'DE'], ['Quited', 'QT'], ['Stated', 'ST'], ['Accepted', 'AC'], ['Rejected', 'RJ']];
    return options;
  }

  public whenTransOptions(amdMod: AmdModelerComponent) {
    var options: String[][];
    options = new Array();
    amdMod.transactionKinds.forEach(tr => options.push([tr.name, tr.name]));
    return options;
  }

  public whileStateOptions(amdMod: AmdModelerComponent) {
    var options = [['Requested', 'RQ'], ['Promised', 'PM'], ['Declined', 'DE'], ['Quited', 'QT'], ['Stated', 'ST'], ['Accepted', 'AC'], ['Rejected', 'RJ']];
    return options;
  }

  public whileTransOptions(amdMod: AmdModelerComponent) {
    //TODO: get child and parent transactions from model
    var options = [['T2', 'T2'], ['T3', 'T3']];
    return options;
  }

}

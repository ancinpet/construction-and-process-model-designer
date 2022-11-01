import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { OCDCommunicationService, SettingsBarProperties } from 'src/app/services/ocd-communication/ocd-communication.service';
import { MatDrawer } from '@angular/material';
import { StateManagerService } from 'src/app/services/state-management/state-manager.service';
import { PsiContract, ActorRole, TransactionKind, ActorRoleType, TransactionSort } from 'src/app/model/model';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-editor-layout',
  templateUrl: './editor-layout.component.html',
  styleUrls: ['./editor-layout.component.scss'],
})

export class EditorLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('sidenavright') private sideNav: MatDrawer;

  paperHidden = false;
  rolePhaseCheckboxHidden = true;
  roleTypeComboboxHidden = true;
  linkTypeComboboxHidden = true;
  waitLinkOptionsHidden = true;
  cardinalityHidden = true;
  cardinalityHiddenAct = true;

  defaultPaperSizeValue = "A4";
  defaultOrientation = "Portrait";
  defaultActorTransactionValue = "original";
  defaultLinkTypeValue = "waitLink";
  defaultLinkActSource = "request";
  defaultLinkSource = "Top";
  defaultLinkActTarget = "request";
  defaultLinkTarget = "Top";
  defaultCasualLinkAct = "promise";
  transactionPhaseValue = false;

  actorRole = null;
  transactionKind = null;

  actorList: Array<ActorRole> = [];
  transactionList: Array<TransactionKind> = [];

  cardinalityFrom = new FormControl("1", [Validators.required, Validators.pattern("(^[0-9]+$)|^n$|^\\*$")]);
  cardinalityFromError() {
    return this.cardinalityFrom.hasError("required") ? "You must enter a value" :
           this.cardinalityFrom.hasError("pattern") ? "Invalid cardinality" :
           "";
  }

  cardinalityTo = new FormControl("1", [Validators.required, Validators.pattern("(^[0-9]+$)|^n$|^\\*$")]);
  cardinalityToError() {
    return this.cardinalityTo.hasError("required") ? "You must enter a value" :
           this.cardinalityTo.hasError("pattern") ? "Invalid cardinality" :
           "";
  }

  events: string[] = [];
  opened: boolean = true;
  propertyBarSubscription:Subscription = null;
  propertyHandlerSubscription:Subscription = null;
  stateManagerSubscription:Subscription = null;

  constructor(private interactionManager: OCDCommunicationService, private stateManager: StateManagerService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {    
    this.propertyBarSubscription = this.interactionManager.getPropertyBar$().subscribe((properties: SettingsBarProperties) => {this.resolvePropertyBarChange(properties)});
    this.propertyHandlerSubscription = this.interactionManager.getPropertyBarHandler$().subscribe(() => {this.sideNav.toggle()});
    this.stateManagerSubscription = this.stateManager.getPsiContract$().subscribe((psiContract => this.updateChoices(psiContract)));
  }

  ngOnDestroy() {
    this.propertyBarSubscription.unsubscribe();
  }

  dispatchProperties() {
    if (this.cardinalityFrom.invalid || this.cardinalityTo.invalid || this.cardinalityFrom.value * 1 > this.cardinalityTo.value * 1) {
      return;
    }

    this.waitLinkOptionsHidden = this.defaultLinkTypeValue != "waitLink" || this.linkTypeComboboxHidden;

    this.interactionManager.dispatchProperties(
      {
        transactionPhase: this.transactionPhaseValue,
        transactionType: this.defaultActorTransactionValue,

        linkType: this.defaultLinkTypeValue,
        linkActSource: this.defaultLinkActSource,
        linkSource: this.defaultLinkSource,
        linkActTarget: this.defaultLinkActTarget,
        linkTarget: this.defaultLinkTarget,

        cardinalityAct: this.defaultCasualLinkAct,
        cardinalityFrom: this.cardinalityFrom.value,
        cardinalityTo: this.cardinalityTo.value
      });
  }

  paperSizeChanged() {
    let [pWidth, pHeight] = this.getSizeFromFormat(this.defaultPaperSizeValue, this.defaultOrientation);

    this.interactionManager.dispatchPaperFormatChange({
      width: pWidth,
      height: pHeight
    });
  }

  bindActor(actor: ActorRole) {
    this.transactionPhaseValue = actor.type == ActorRoleType.composite;
    this.interactionManager.dispatchActorBind(actor);
  }

  bindTransaction(transaction: TransactionKind) {
    this.defaultActorTransactionValue = this.stringFromSort(transaction.transactionSort);
    this.interactionManager.dispatchTransactionBind(transaction);
  }

  private getSizeFromFormat(format: string, orientation: string): [number, number] {
    let size: [number, number] = [0, 0]

    switch (format) {
      case "A0":
        size = [841, 1189];
        break;
      case "A1":
        size = [594, 841];
        break;
      case "A2":
        size = [420, 594];
        break;
      case "A3":
        size = [297, 420];
        break;
      case "A4":
        size = [210, 297];
        break;
      case "A5":
        size = [148, 210];
        break;
      case "A6":
        size = [105, 148];
        break;
      case "A7":
        size = [74, 105];
        break;
      default:
        size = [10000, 10000];
        break;
    }

    if (orientation == "Landscape") {
      return [size[1], size[0]];
    }

    return size;
  }

  private updateChoices(psiContract: PsiContract): void {
    let oldActorGuid = this.actorRole ? this.actorRole.id : Guid.createEmpty();
    this.actorList = new Array();
    for (let actor of psiContract.actorRoles) {
      this.actorList.push(actor);
    }
    this.actorRole = this.findActor(oldActorGuid.toString());

    let oldTransactionGuid = this.transactionKind ? this.transactionKind.id : Guid.createEmpty();
    this.transactionList = new Array();
    for (let transaction of psiContract.transactionKinds) {
      this.transactionList.push(transaction);
    }
    this.transactionKind = this.findTransaction(oldTransactionGuid.toString());
  }

  private resolvePropertyBarChange(properties: SettingsBarProperties) {
    this.paperHidden = properties.rolePhaseCheckboxShown || properties.roleTypeComboboxShown || properties.linkTypeComboboxShown || properties.cardinalityShown;
    this.rolePhaseCheckboxHidden = !properties.rolePhaseCheckboxShown;
    this.roleTypeComboboxHidden = !properties.roleTypeComboboxShown;
    this.linkTypeComboboxHidden = !properties.linkTypeComboboxShown;
    this.cardinalityHidden = !properties.cardinalityShown;
    this.cardinalityHiddenAct = !properties.cardinalityShown;

    this.defaultActorTransactionValue = properties.roleTypeComboboxValue;
    this.actorRole = this.findActor(properties.selectedActorGuid);
    this.transactionKind = this.findTransaction(properties.selectedTransactionGuid);
    this.transactionPhaseValue = properties.rolePhaseCheckboxChecked;

    this.defaultLinkTypeValue = properties.linkTypeComboboxValue;
    this.defaultLinkActSource = properties.linkActValueSource;
    this.defaultLinkSource = properties.linkSourcePosition;
    this.defaultLinkActTarget = properties.linkActValueTarget;
    this.defaultLinkTarget = properties.linkTargetPosition;

    if (properties.cardinalityAct == "hidden") {
      this.cardinalityHiddenAct = true;
    } else {
      this.defaultCasualLinkAct = properties.cardinalityAct;
    }
    this.cardinalityFrom.setValue(properties.cardinalityFromValue);
    this.cardinalityTo.setValue(properties.cardinalityToValue);
  }

  private findActor(guidS: string): ActorRole {
    let guid = Guid.createEmpty();
    if (guidS) {
      guid = Guid.parse(guidS);
    }
    
    for (let actor of this.actorList) {
      if (actor.id.equals(guid)) {
        return actor;
      }
    }

    return null;
  }

  private findTransaction(guidS: string): TransactionKind {
    let guid = Guid.createEmpty();
    if (guidS) {
      guid = Guid.parse(guidS);
    }
    
    for (let transaction of this.transactionList) {
      if (transaction.id.equals(guid)) {
        return transaction;
      }
    }

    return null;
  }

  private stringFromSort(sort: TransactionSort): string {
    if (sort == TransactionSort.informational) {
      return "informational";
    } else if (sort == TransactionSort.documental) {
      return "documental";
    }

    return "original";
  }
}
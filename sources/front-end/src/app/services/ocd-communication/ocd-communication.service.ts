import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ActorRole, TransactionKind } from 'src/app/model/model';

export interface ModelProperties {
  transactionPhase: boolean,
  transactionType: string,

  linkType: string,
  linkActSource: string,
  linkSource: string,
  linkActTarget: string,
  linkTarget: string,

  cardinalityAct: string,
  cardinalityFrom: string,
  cardinalityTo: string
}

export interface SettingsBarProperties {
  rolePhaseCheckboxShown: boolean,
  roleTypeComboboxShown: boolean,
  linkTypeComboboxShown: boolean,
  cardinalityShown: boolean,

  rolePhaseCheckboxChecked: boolean,
  selectedActorGuid: string,
  selectedTransactionGuid: string,
  roleTypeComboboxValue: string,

  linkTypeComboboxValue: string,
  linkActValueSource: string,
  linkSourcePosition: string,
  linkActValueTarget: string,
  linkTargetPosition: string,

  cardinalityAct: string,
  cardinalityFromValue: string,
  cardinalityToValue: string
}

export interface PaperFormatProperties {
  width: number,
  height: number
}                                                                                                                        

@Injectable({
  providedIn: 'root'
})

export class OCDCommunicationService {

  private propertiesStream$: Subject<ModelProperties> = new Subject();
  private propertyBarStream$: Subject<SettingsBarProperties> = new Subject();
  private propertyBarHandler$: Subject<any> = new Subject();
  private paperFormatHandler$: Subject<PaperFormatProperties> = new Subject();
  private actorToBindHandler$: Subject<ActorRole> = new Subject();
  private transactionToBindHandler$: Subject<TransactionKind> = new Subject();

  constructor() { }

  dispatchProperties(properties: ModelProperties) {
    this.propertiesStream$.next(properties);
  }

  getModelProperties$(): Observable<ModelProperties> {
    return this.propertiesStream$.asObservable();
  }

  dispatchPropertyBarChange(properties: SettingsBarProperties) {
    this.propertyBarStream$.next(properties);
  }

  getPropertyBar$(): Observable<SettingsBarProperties> {
    return this.propertyBarStream$.asObservable();
  }

  dispatchPropertyBarToggle() {
    this.propertyBarHandler$.next();
  }

  getPropertyBarHandler$(): Observable<any> {
    return this.propertyBarHandler$.asObservable();
  }

  dispatchPaperFormatChange(properties: PaperFormatProperties) {
    this.paperFormatHandler$.next(properties);
  }

  getPaperFormatHandler$(): Observable<PaperFormatProperties> {
    return this.paperFormatHandler$.asObservable();
  }

  dispatchActorBind(properties: ActorRole) {
    this.actorToBindHandler$.next(properties);
  }

  getActorBindHandler$(): Observable<ActorRole> {
    return this.actorToBindHandler$.asObservable();
  }

  dispatchTransactionBind(properties: TransactionKind) {
    this.transactionToBindHandler$.next(properties);
  }

  getTransactionBindHandler$(): Observable<TransactionKind> {
    return this.transactionToBindHandler$.asObservable();
  }
}

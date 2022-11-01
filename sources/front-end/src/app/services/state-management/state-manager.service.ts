import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { Store, Action } from '@ngrx/store';
import { PsiContract, IPsiContract, IActorRole, ITransactionKind, IProcess, IActionRule, IDataModel } from "../../model";
import { map } from 'rxjs/operators';
import { Guid } from 'guid-typescript';

/**
 * State Manager of the application
 * it uses ngrx store to manage state
 * it uses signalr to synchronize changes in real-time @see SignalrService
 * 
 */
@Injectable({
  providedIn: 'root'
})
export class StateManagerService {

  private actionStream$: Subject<IAction> = new Subject();
  private stateStream$: Observable<PsiContractEditorState>;

  constructor(private store: Store<PsiContractEditorState>) {

    this.actionStream$.subscribe((action: IAction) => { this.store.dispatch(action); });
    this.stateStream$ = store.select("psiContractEditor");
  }

  /**
   * dispatch action to the store
   * @param action 
   */
  dispatchAction(action: IAction) {
    this.actionStream$.next(action);
  }

  /**
   * @returns state of the app as observable
   */
  getState$(): Observable<PsiContractEditorState> {
    return this.stateStream$;
  }

   /**
   * @returns slice state (PsiContract) of the app as observable
   */
  getPsiContract$(): Observable<IPsiContract> {
    return this.stateStream$.pipe(map(state => state.psiContract));
  }

  /**
   * @returns slice state (ActorRoles) of the app as observable
   */
  getActorRoles$(): Observable<IActorRole[]> {
    return this.stateStream$.pipe(map(state => state.psiContract.actorRoles));
  }

  /**
   * @returns slice state (TransactionKinds) of the app as observable
   */
  getTransactionKinds$(): Observable<ITransactionKind[]> {
    return this.stateStream$.pipe(map(state => state.psiContract.transactionKinds));
  }

  /**
   * @returns slice state (Processes) of the app as observable
   */
  getProcesses$(): Observable<IProcess[]> {
    return this.stateStream$.pipe(map(state => state.psiContract.processes));
  }

  /**
   * @returns slice state (ActionRules) of the app as observable
   */
  getActionRules$(): Observable<IActionRule[]> {
    return this.stateStream$.pipe(map(state => state.psiContract.actionRules));
  }

  /**
   * @returns slice state (DataModel) of the app as observable
   */
  getDataModel$(): Observable<IDataModel> {
    return this.stateStream$.pipe(map(state => state.psiContract.dataModel));
  }

}

/**
 * definition of application state
 */
export class PsiContractEditorState {
  public undoStack: PsiContract[];
  public redoStack: PsiContract[];
  constructor(public psiContract: PsiContract, undoStack?: PsiContract[], redoStack?: PsiContract[]) {

    if (undoStack) {
      this.undoStack = undoStack;
    }
    else {
      this.undoStack = [];
    }

    if (redoStack) {
      this.redoStack = redoStack;
    }
    else {
      this.redoStack = [];
    }
  }
}

/**
 * Action types (constant string values)
 * constants wrapper class, substitution for enum
 */
export abstract class ActionType {

  // ---------------- AM -------------------
  public static readonly AddActionRule = 'AddActionRule';
  public static readonly RemoveActionRule = 'RemoveActionRule';
  public static readonly UpdateActionRule = 'UpdateActionRule';

  // -------------- BPMN ----------------
  public static readonly AddBpmnDiagram = 'AddBpmnDiagram';
  public static readonly RemoveBpmnDiagram = 'RemoveBpmnDiagram';
  public static readonly UpdateBpmnDiagram = 'UpdateBpmnDiagram';

  // -------------- OCD (CSD) --------------------

  public static readonly AddProcess = 'AddProcess';
  public static readonly RemoveProcess = 'RemoveProcess';
  public static readonly ChangeProcess = 'ChangeProcess';

  public static readonly AddCompositeTransactor = 'AddCompositeTransactor';
  public static readonly AddSelfActivatingTransactor = 'AddSelfActivatingTransactor';
  public static readonly AddElementaryTransactor = 'AddElementaryTransactor';
  public static readonly RemoveTransactor = 'RemoveTransactor';

  public static readonly AddWaitLink = 'AddWaitLink';

  public static readonly ChangeTransactorContent = 'ChangeTransactorContent';
  public static readonly ChangeActorContent = 'ChangeActorContent';
  public static readonly ChangeTransactionContent = 'ChangeTransactionContent';
  public static readonly ChangeConstraintLink = 'ChangeConstraintLink';
  public static readonly RemoveConstraintLink = 'RemoveConstraintLink';

  public static readonly SwapVertices = 'SwapVertices';
  public static readonly AppendTransactor = 'AppendTransactor';
  public static readonly AppendTransactorAfter = 'AppendTransactorAfter';

  public static readonly RemoveActorRole = 'RemoveActorRole';
  public static readonly RemoveTransactionKind = 'RemoveTransactionKind';

  // --------- other ------------
  public static readonly UndoChange = 'UndoChange';
  public static readonly RedoChange = 'RedoChange';
  public static readonly LoadModel = 'LoadModel';
  public static readonly SaveModel = 'SaveModel';
  public static readonly ChangeModelName = 'ChangeModelName';
  public static readonly ImportModel = 'ImportModel';
  public static readonly NewModel = 'NewModel';


  // ---------- recieved from server -----------
  public static readonly AddProcess_RECEIVED = 'AddProcess_RECEIVED';
  public static readonly RemoveProcess_RECEIVED = 'RemoveProcess_RECEIVED';
  public static readonly ChangeProcess_RECEIVED = 'ChangeProcess_RECEIVED';
  public static readonly AddCompositeTransactor_RECEIVED = 'AddCompositeTransactor_RECEIVED';
  public static readonly AddSelfActivatingTransactor_RECEIVED = 'AddSelfActivatingTransactor_RECEIVED';
  public static readonly AddElementaryTransactor_RECEIVED = 'AddElementaryTransactor_RECEIVED';
  public static readonly RemoveTransactor_RECEIVED = 'RemoveTransactor_RECEIVED';
  
  public static readonly UndoChange_RECEIVED = 'UndoChange_RECEIVED';
  public static readonly RedoChange_RECEIVED = 'RedoChange_RECEIVED';
  public static readonly ChangeModelName_RECEIVED = 'ChangeModelName_RECEIVED';
  public static readonly AddWaitLink_RECEIVED = 'AddWaitLink_RECEIVED';
  public static readonly ChangeTransactorContent_RECEIVED = 'ChangeTransactorContent_RECEIVED';
  public static readonly ChangeActorContent_RECEIVED = 'ChangeActorContent_RECEIVED';
  public static readonly ChangeTransactionContent_RECEIVED = 'ChangeTransactionContent_RECEIVED';
  public static readonly ChangeConstraintLink_RECEIVED = 'ChangeConstraintLink_RECEIVED';
  public static readonly SwapVertices_RECEIVED = 'SwapVertices_RECEIVED';
  public static readonly AppendTransactor_RECEIVED = 'AppendTransactor_RECEIVED';
  public static readonly AppendTransactorAfter_RECEIVED = 'AppendTransactorAfter_RECEIVED';
  public static readonly RemoveActorRole_RECEIVED = 'RemoveActorRole_RECEIVED';
  public static readonly RemoveTransactionKind_RECEIVED = 'RemoveTransactionKind_RECEIVED';
  public static readonly RemoveConstraintLink_RECEIVED = 'RemoveConstraintLink_RECEIVED';
  public static readonly NewModel_RECEIVED = 'NewModel_RECEIVED';
  public static readonly AddBpmnDiagram_RECEIVED = 'AddBpmnDiagram_RECEIVED';
  public static readonly RemoveBpmnDiagram_RECEIVED = 'RemoveBpmnDiagram_RECEIVED';
  public static readonly UpdateBpmnDiagram_RECEIVED = 'UpdateBpmnDiagram_RECEIVED';
    public static readonly ImportModel_RECEIVED = 'ImportModel_RECEIVED';
    public static readonly AddActionRule_RECIEVED = 'AddActionRule_RECIEVED';
    public static readonly UpdateActionRule_RECIEVED = 'UpdateActionRule_RECIEVED';
    public static readonly RemoveActionRule_RECIEVED = 'RemoveActionRule_RECIEVED';
}
/**
 * interface defining action payload
 * actionId is required to be part of payload
 * to id action and provide new versionId of the contract
 */
export interface IActionPayload {
  actionId: Guid;
}
/**
 * interface defining composition of the action
 * actions are commands/request to update app  state in the store
 */
export interface IAction extends Action {
  type: string;
  payload?: IActionPayload;
}


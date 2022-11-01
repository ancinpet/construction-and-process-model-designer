import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { SignalrService } from '../../signalr/signalr.service';
import { ActionType } from '../state-manager.service';

/**
  * ngrx effects implementation for psi contract editor
  * 
 */
@Injectable()
export class PsiContractEditorEffects {

    constructor(private actions$: Actions, private hubService: SignalrService) { }

    /**
    *  use signalr to send specified actions to server for real-time synchronization
    * 
    */
    @Effect({ dispatch: false })
    synchronization$: Observable<Action> = this.actions$.pipe(
        ofType(
            ActionType.AddProcess,
            ActionType.RemoveProcess,
            ActionType.ChangeProcess,
            ActionType.AddCompositeTransactor,
            ActionType.AddSelfActivatingTransactor,
            ActionType.AddElementaryTransactor,
            ActionType.RemoveTransactor,
            ActionType.RemoveActorRole,
            ActionType.RemoveTransactionKind,
            ActionType.UndoChange,
            ActionType.RedoChange,
            ActionType.ChangeModelName,
            ActionType.AddWaitLink,
            ActionType.ChangeTransactorContent,
            ActionType.ChangeActorContent,
            ActionType.ChangeTransactionContent,
            ActionType.ChangeConstraintLink,
            ActionType.RemoveConstraintLink,
            ActionType.SwapVertices,
            ActionType.AppendTransactor,
            ActionType.AppendTransactorAfter,
            ActionType.NewModel,
            ActionType.AddBpmnDiagram,
            ActionType.UpdateBpmnDiagram,
            ActionType.RemoveBpmnDiagram,
            ActionType.ImportModel,
            ActionType.AddActionRule,
            ActionType.UpdateActionRule,
            ActionType.RemoveActionRule
        ),
        tap(action => this.hubService.sendAction(action))
    );

     /**
   * log actions processed by the store
   * 
  */
    @Effect({ dispatch: false })
    logging$: Observable<Action> = this.actions$.pipe(
        //tap(action => console.log("[EFFECTS LOG] ", action)), // disabled
    );
}

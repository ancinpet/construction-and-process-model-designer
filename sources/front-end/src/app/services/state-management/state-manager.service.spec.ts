import { TestBed } from '@angular/core/testing';


import { StateManagerService, IAction, PsiContractEditorState } from './state-manager.service';
import { PsiContractEditorReducer, intialState, clone } from './reducers';
import * as ModelUtils from 'src/app/model/utils';
import { IProcess, Process } from 'src/app/model';
import { Guid } from 'guid-typescript';
import { AddProcessAction, ChangeModelNameAction, UndoChangeAction, RedoChangeAction } from './actions';

describe('StateManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateManagerService = TestBed.get(StateManagerService);
    expect(service).toBeTruthy();
  });
});

describe('Reducers test', () => {


  it('should handle initial state', () => {
    expect(
      ModelUtils.equals(PsiContractEditorReducer.reducer(undefined, {} as IAction), intialState)
    )
      .toBe(true);
  });

  it('should ignore unknown actions', () => {
    expect(
      ModelUtils.equals(PsiContractEditorReducer.reducer(intialState, { type: "DONOTCARE" }), intialState)
    )
      .toBe(true);
  });

  it('should add new process', () => {
    let id = Guid.create();
    let name = "process name";
    let process: IProcess = new Process(id, name, null);
    let newState = clone<PsiContractEditorState>(intialState);
    newState.undoStack.push(intialState.psiContract);
    newState.psiContract.processes.push(process);

    expect(
      ModelUtils.equals(PsiContractEditorReducer.reducer(intialState, new AddProcessAction(id, name)), newState)
    )
      .toBe(true);
  });

  it('should add new process', () => {
    let id = Guid.create();
    let name = "process name";
    let process: IProcess = new Process(id, name, null);
    let action = new AddProcessAction(id, name);
    let newState = clone<PsiContractEditorState>(intialState);
    newState.undoStack.push(intialState.psiContract);
    newState.psiContract.processes.push(process);
    newState.psiContract.versionId = action.actionId;
    expect(
      ModelUtils.equals(PsiContractEditorReducer.reducer(intialState, action), newState)
    )
      .toBe(true);
  });


  it('it should change name', () => {
    let id = Guid.create();
    let name = "model name";
    let action = new ChangeModelNameAction(name);
    let newState = clone<PsiContractEditorState>(intialState);
    newState.undoStack.push(intialState.psiContract);
    newState.psiContract.name = name;
    newState.psiContract.versionId = action.payload.actionId;

    expect(
      ModelUtils.equals(PsiContractEditorReducer.reducer(intialState, action), newState)
    )
      .toBe(true);
  });


  it('it should do undo and redo', () => {
    let id = Guid.create();
    let name = "model name";
    let action = new ChangeModelNameAction(name);
    let newState = clone<PsiContractEditorState>(intialState);
    newState.undoStack.push(intialState.psiContract);
    newState.psiContract.name = name;
    newState.psiContract.versionId = action.payload.actionId;

    expect(
      ModelUtils.equals(PsiContractEditorReducer.reducer(intialState, action), newState)
    )
      .toBe(true);

    let newState2 = clone<PsiContractEditorState>(intialState);
    newState2.redoStack.push(newState.psiContract);

    expect(
      ModelUtils.equals(PsiContractEditorReducer.reducer(newState, new UndoChangeAction()), newState2)
    )
      .toBe(true);

    expect(
      ModelUtils.equals(PsiContractEditorReducer.reducer(newState2, new RedoChangeAction()), newState)
    )
      .toBe(true);
  });

});
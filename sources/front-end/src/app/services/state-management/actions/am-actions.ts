import * as Models from '../../../model'
import { Guid } from 'guid-typescript';
import { IAction, ActionType, IActionPayload } from 'src/app/services/state-management/state-manager.service';



export abstract class AMAction {
  abstract get payload(): any;
  abstract get type(): string;
}

export class AddActionRulePayload implements IActionPayload {
  constructor(public actionRule: Models.IActionRule, public actionId: Guid) { }
}

export class AddActionRule {
  private _value: AddActionRulePayload;
  public type: string = ActionType.AddActionRule;

  constructor(_id: Guid, _blockId: string, _xml: string) {
    this._value = new AddActionRulePayload(new Models.ActionRule(_id, _blockId, _xml), Guid.create());
  }

  get payload(): AddActionRulePayload {
    return this._value;
  }
}

export class UpdateActionRulePayload implements IActionPayload {
  constructor(public actionRule: Models.IActionRule, public actionId:Guid) { }
}

export class UpdateActionRule {
  private _value: UpdateActionRulePayload;
  public type: string = ActionType.UpdateActionRule;

  constructor(_id: Guid, _blockId: string, _xml: string) {
    this._value = new UpdateActionRulePayload(new Models.ActionRule(_id, _blockId, _xml), Guid.create());
  }

  get payload(): UpdateActionRulePayload {
    return this._value;
  }
}

export class RemoveActionRulePayload implements IActionPayload {
  constructor(public ruleId: Guid, public actionId: Guid) { }
}

export class RemoveActionRule extends AMAction {
  private _value: RemoveActionRulePayload;
  public type: string = ActionType.RemoveActionRule;

  constructor(_id: Guid) {
    super();
    this._value = new RemoveActionRulePayload(_id, Guid.create());
  }

  get payload(): RemoveActionRulePayload {
    return this._value;
  }

}

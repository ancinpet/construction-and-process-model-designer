import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TreeNode, NodeType } from '../tree-view2/tree-view2.component';
import * as ModelUtils from 'src/app/model/utils';
import { IPsiContract } from 'src/app/model';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import * as AMActions from 'src/app/services/state-management/actions'
import { StateManagerService, IAction, ActionType } from "src/app/services/state-management/state-manager.service"

@Component({
  selector: 'app-tree-view-node',
  templateUrl: './tree-view-node.component.html',
  styleUrls: ['./tree-view-node.component.scss']
})
export class TreeViewNodeComponent {

  constructor(protected stateManager: StateManagerService, private router: Router) { }
  private _node: TreeNode;

  @Input()
  set node(node: TreeNode) {
    this._node = node;
  }
  get node(): TreeNode {
    return this._node;
  }

  @Input()
  psiContract: IPsiContract;

  @Output() contextMenuEvents = new EventEmitter<MouseEvent>();
  @Output() removeActorRoleEvents = new EventEmitter();
  @Output() removeTransactionKindEvents = new EventEmitter();
  @Output() removeBpmnDiagramEvents = new EventEmitter();

  isMouseOver: Boolean = false;
  showActionBtn(): Boolean {
    return this.isMouseOver && this.isRemovable(this._node);
  }

  onContextMenu(event: MouseEvent) {
    this.contextMenuEvents.emit(event);
  }

  onRemoveActorRole() {
    this.removeActorRoleEvents.emit();
  }

  onRemoveTransactionKind() {
    this.removeTransactionKindEvents.emit();
  }

  onRemoveBpmnDiagram() {
    this.removeBpmnDiagramEvents.emit();
  }

  onCreateActionRule() {
    let id = Guid.create();
    let action = new AMActions.AddActionRule(id, "ActionRule", "");
    this.stateManager.dispatchAction(action);
    this.router.navigate(['/modelerAmd/' + id]);
  }

  onEditActionRule(id: Guid) {
    this.router.navigate(['/modelerAmd/' + id]);
  }

  onEditBpmnDiagram(processId: Guid, bpmnId: Guid) {
    this.router.navigate(['/modelerPsd/'+ processId + '/' + bpmnId]);
  }

  isRemovable(node: TreeNode): boolean {
    let result: boolean;
    switch (node.type) {
      case NodeType.actorRole:
        result = !ModelUtils.actorRoleIsReferenced(this.psiContract, node.id);
        break;
      case NodeType.transactionKind:
        result = !ModelUtils.transactionKindIsReferenced(this.psiContract, node.id);
        break;
      case NodeType.bpmn:
        result = true;
        break;
      default:
        result = false;
        break;
    }
    return result;
  }
}

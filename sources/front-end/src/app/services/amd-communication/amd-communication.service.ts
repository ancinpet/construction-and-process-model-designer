import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ActionRule } from 'src/app/model/model';

@Injectable({
  providedIn: 'root'
})

export class AMDCommunicationService {

  private actionRuleToBindHandler$: Subject<ActionRule> = new Subject();

  dispatchActionRuleBind(properties: ActionRule) {
    this.actionRuleToBindHandler$.next(properties);
  }

  getActionRuleBindHandler$(): Observable<ActionRule> {
    return this.actionRuleToBindHandler$.asObservable();
  }

}

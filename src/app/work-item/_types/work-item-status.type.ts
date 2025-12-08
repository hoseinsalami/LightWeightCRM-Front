import {WorkItemStatesEnum} from "../../path/_enums/work-item-states.enum";

export interface WorkItemStatusType {
  workItemId?: number;
  // isFailed?: boolean;
  newState?: WorkItemStatesEnum;
  failureReasonId?: number;
  description?: string;
}

export interface FailureReasonsType {
  id?:number;
  title?: string;
}

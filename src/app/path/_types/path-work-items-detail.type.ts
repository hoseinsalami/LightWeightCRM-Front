import {GenericType} from "../../_types/genericType.type";
import {CustomerSpecification, WorkItemType} from "./create-work-item.type";
import {WorkItemStatesEnum} from "../_enums/work-item-states.enum";

export class StepType extends GenericType<StepType> {

  title?: string;
  caption?: string;
  order?: number;
  workItems?: WorkItemType[];
  totalWorkItems?: number;
  constructor(model?: Partial<StepType>) {
    super(model);

    if (model.workItems) {
      this.workItems = model.workItems.map(w => { return new WorkItemType(w) })
    } else {
      this.workItems = [];
    }

  }

}

export class PathWorkItemsDetailType extends GenericType<PathWorkItemsDetailType>{

  // step?: StepType;
  //  workItems?: WorkItemType[];
  title?: string;
  order?: number;
  totalWorkItems:number;

  constructor(model?: Partial<PathWorkItemsDetailType>) {
    super(model);

    // if (model.step) {
    //   this.step = new WorkItemType(model.step)
    // }
    //
    // if (model.workItems) {
    //   this.workItems = model.workItems.map(w => { return new WorkItemType(w) })
    // } else {
    //   this.workItems = [];
    // }

  }
}


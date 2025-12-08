import {GenericType} from "../../_types/genericType.type";
import {CustomerSpecification, WorkItemType} from "../../path/_types/create-work-item.type";
import {CommentType} from "../../work-item/_types/activity-workItem.type";
import {UserTypeBase} from "../../setting/_types/user.type";

export class ActivitiesType extends GenericType<ActivitiesType>{
  comments?: CommentType[];
  customer?: CustomerSpecification;
  assignedUser?: UserTypeBase;
  description?: string;
  dueDate?: string;
  doneDate?: string;
  title?: string;
  user?:UserTypeBase;
  workItem?:WorkItemType;
  isStagnant?: boolean;
  isExpired?: boolean;
  totalRecords?: number;
  constructor(model?: Partial<ActivitiesType>) {
    super(model);

    if (model.user){
      this.user = new UserTypeBase(model.user)
    } else {
      this.user = new UserTypeBase({})
    }

    if (model.assignedUser){
      this.assignedUser = new UserTypeBase(model.assignedUser)
    } else {
      this.assignedUser = new UserTypeBase({})
    }

    if (model.workItem){
      this.workItem = new WorkItemType(model.workItem)
    } else {
      this.workItem = new WorkItemType({})
    }

    if (model.customer){
      this.customer = new CustomerSpecification(model.customer)
    } else {
      this.customer = new CustomerSpecification({})
    }

    if (model.comments){
      this.comments = model.comments.map(c => {return new CommentType(c)})
    } else {
      this.comments = [];
    }
  }
}

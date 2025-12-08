import {GenericType} from "../../_types/genericType.type";
import {UserTypeBase} from "../../setting/_types/user.type";
import {WorkItemType} from "../../path/_types/create-work-item.type";
import {AttachmentType} from "../../_types/create-activity.type";

export interface IStructureData<T>{
  items?:T[];
  totalRecords?: number;
  counts?: ICountsData
}

export interface ICountsData {
  doneDateActivitesCount?: number;
  notArrivedActivitesCount?: number;
  overDuedActivitesCount?: number;
}

export class ActivityWorkItemType extends GenericType<ActivityWorkItemType>{
  title?: string;
  dueDate?:string;
  isDone?: boolean;
  description?: string;
  user?: UserTypeBase;
  assignedUser?: UserTypeBase;
  workItem?: WorkItemType;
  comments?: CommentType[];
  attachments?: AttachmentType[];
  doneDate?:string;
  customerId?:string;
  result?:string;

  constructor(model?: Partial<ActivityWorkItemType>) {
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

    if (model.comments){
      this.comments = model.comments.map(c => {return new CommentType(c)})
    } else {
      this.comments = [];
    }

    if (model?.attachments){
      this.attachments = model.attachments.map( c => {return  new AttachmentType(c)});
    }

  }
}

export class CommentType extends GenericType<CommentType>{
  content?: string;
  createAt?: any;
  user?: UserTypeBase;

  constructor(model?: Partial<CommentType>) {
    super(model);

    if (model.user){
      this.user = new UserTypeBase(model.user)
    } else{
      this.user = new UserTypeBase({})
    }

  }

}

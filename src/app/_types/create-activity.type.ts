import {GenericType} from "./genericType.type";
import {FileTypeEnum} from "../_enums/file-type.enum";
import {UserTypeBase} from "../setting/_types/user.type";
import {TimeUnitsEnum} from "../_enums/TimeUnits.enum";
import {CustomerSpecification, WorkItemType} from "../path/_types/create-work-item.type";

export class CreateActivityType extends GenericType<CreateActivityType>{
  title?:string;
  description?:string;
  iconClass?:string;
  duration?:number; // مدت زمان انجام فعالیت
  dueDate?:any; // تاریخ انجام فعالیت
  doneDate?:any;
  customerId?: number;
  workItemId?: number;
  userId?: number;
  relatedUsersIds?: number[];
  activityTypeId?: number;
  attachments?:any;
  reminders?:TimePeriod[];
  workItem?: WorkItemType;
  customer?: CustomerSpecification;
  activityReminderId?:number;
  constructor(model?: Partial<CreateActivityType>) {
    super(model);

    if (model.reminders){
      this.reminders = model.reminders.map(r => { return new TimePeriod(r)});
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

  }
}

export class CreateAttachmentDTO extends GenericType<CreateAttachmentDTO>{
  url?:string;
  title?: string;
  AttachmentType?: FileTypeEnum;
  workItemId?: number;
  customerId?: number;
  constructor(model?:Partial<CreateAttachmentDTO>) {
    super(model);
  }
}
export class AttachmentType extends GenericType<AttachmentType> {
  attachmentType?: number;
  title?: string;
  user?: UserTypeBase
  constructor(model?: Partial<AttachmentType>) {
    super(model);

    if (model.user){
      this.user = new UserTypeBase(model.user)
    }

  }
}

export class TimePeriod {
  value?: number;
  periodTimeUnit?: TimeUnitsEnum;
  constructor(model?: Partial<TimePeriod>) {
  }
}

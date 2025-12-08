import {GenericType} from "../../_types/genericType.type";
import {WorkItemStatesEnum} from "../_enums/work-item-states.enum";
import {UserTypeBase} from "../../setting/_types/user.type";
import {AccustomType} from "../../setting/_types/accustom.type";
import {TicketBaseType} from "../../tickets/_types/ticket-base.type";
import {StepType} from "./path-work-items-detail.type";
import {TagTypeBase} from "../../setting/_types/tag.type";
import {MessagingPlatformEnum} from "../_enums/messaging-platform.enum";

export class WorkItemType extends GenericType<WorkItemType>{
  title?: string;
  description?:string;
  deadline?: string;
  status?: WorkItemStatesEnum;
  customer?: CustomerSpecification;
  messages?: IMessagesType[]
  currentUser?: UserTypeBase;
  stepId?: number;
  pathId?: number;
  path: StepType;
  extraData?: string; // این فیلد به Json تبدیل شود
  isStagnant?: boolean;
  tags?: TagTypeBase[]
  activityCount?: number;
  noteCount?: number;

  constructor(model?: Partial<WorkItemType>) {
    super(model);
    if (model.customer){
      this.customer = new CustomerSpecification(model.customer)
    } else {
      this.customer = new CustomerSpecification({})
    }

    if (model.currentUser){
      this.currentUser = new UserTypeBase(model.currentUser)
    } else {
      this.currentUser = new UserTypeBase({})
    }

    if (model.path){
      this.path = new StepType(model.path)
    } else {
      this.path = new StepType({})
    }

    if (model?.tags){
      this.tags = model.tags.map( t => {return  new TagTypeBase(t)})
    }

  }
}

export class CreateWorkItemType extends WorkItemType{
  // description?: string;
  // pathId?: number;
  // extraData?: string; // این فیلد باید تبدیل به JSON شود
  customerId?: number;
  responsibleUserId?: number;
  constructor(model?: Partial<CreateWorkItemType>) {
    super(model);

  }

}

export class CustomerSpecification extends GenericType<CustomerSpecification>{
  name?: string;
  family?: string;
  phone?: string;
  mobile?: string;
  companyName?: string;
  fullName?: string;
  gender?: number;
  group?: string;
  nationalId?: string;
  branches?: string[];
  customerPhones?: CreateCustomerPhone[];
  accustomMethodId?: number;
  accustomMethod?: AccustomType;
  workItems?: WorkItemType[];
  tickets?:TicketBaseType[];
  tags?: TagTypeBase[];
  isCustomer?: boolean;

  constructor(model?: Partial<CustomerSpecification>) {
    super(model)
    if (model?.customerPhones){
      this.customerPhones = model.customerPhones.map( c => {return  new CreateCustomerPhone(c)})
    }

    if (model.workItems) {
      this.workItems = model.workItems.map(w => {return new WorkItemType(w)});
    }

    if (model.tickets){
      this.tickets = model.tickets.map(t => {return new TicketBaseType(t)});
    }

    if (model?.accustomMethod){
      this.accustomMethod = new AccustomType(model.accustomMethod)
      this.accustomMethodId = model?.accustomMethod.id
    }

    if (model?.branches) {
      this.branches = [...model.branches];
    }

    if (model.tags){
      this.tags = model.tags.map(t => {return new TagTypeBase(t)});
    }


  }
}

export class CreateCustomerPhone extends GenericType<CreateCustomerPhone> {
  title?: string;
  phoneNumber?: string;

  constructor(model?: Partial<CreateCustomerPhone>) {
    super(model)
  }
}


export interface IMessagesType {
  id?: number;
  createTime?: string;
  currentUser?: UserTypeBase;
  lastSend?: string;
  message?: string;
  phoneNumber?: string;
  platform?: MessagingPlatformEnum
  sendDateTime?: string;
  sendWasSuccessful?: boolean;
  totalSendCount?: number;
  workItem?: ICommonType;
}

export interface ICommonType {
  id?: number;
  title?: string;
}

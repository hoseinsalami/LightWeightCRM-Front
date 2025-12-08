import {GenericType} from "../../_types/genericType.type";
import {UserTypeBase} from "../../setting/_types/user.type";
import {CreateCustomerPhone, CustomerSpecification} from "../../path/_types/create-work-item.type";
import {TicketTypeEnum} from "../../_enums/ticket-type.enum";

export class TicketBaseType extends GenericType<TicketBaseType>{

  billTrackNumber?: string;
  billUrl?: string;
  closeDateTime?: any;
  createAt?:any;
  currentUser?: UserTypeBase;
  customerBillCount?: number;
  customerFullName?: string;
  customerLastBillDateTime?: string;
  customerPhone?: string;
  customerRegisterDateTime?: string;
  destination?: string;
  pastBills?: PastBills[]
  bill?: PastBills;
  readDateTime?: any;
  receiver?: string;
  source?: string;
  ticketType?: TicketTypeEnum;
  title?: string;
  deadline?: string;
  customer?: CustomerSpecification;
  registerEmployee:string;
  customerFeel?:CustomerFeelsEnum;
  description?:string

  constructor(model?:Partial<TicketBaseType>) {
    super(model);


    if (model?.pastBills){
      this.pastBills = model.pastBills.map( c => {return  new PastBills(c)})
    }

    if (model.bill){
      this.bill = new PastBills(model.bill);
    }

    if (model.customer){
      this.customer = new CustomerSpecification(model.customer);
    }

    if (model.currentUser){
      this.currentUser = new UserTypeBase(model.currentUser);
    } else {
      this.currentUser = new UserTypeBase({});
    }

  }
}

export class PastBills extends GenericType<PastBills>{
  billUrl?: string;
  createTime?: string;
  destination?: string;
  receiver?: string;
  source?: string;
  trackingNumber?: string;
  constructor(model?: Partial<PastBills>) {
    super(model);
  }
}


export enum CustomerFeelsEnum {
  Unknown,
  Neutral,
  Angry,
  VeryAngry,
  Happy,
  VeryHappy
}

export const CustomerFeelsEnum2LabelMapping: Record<CustomerFeelsEnum, string> = {
  [CustomerFeelsEnum.Unknown]: '❓',
  [CustomerFeelsEnum.Neutral]: '😐',
  [CustomerFeelsEnum.Angry]: '😠',
  [CustomerFeelsEnum.VeryAngry]: '🤬',
  [CustomerFeelsEnum.Happy]: '😊',
  [CustomerFeelsEnum.VeryHappy]: '😁',
}

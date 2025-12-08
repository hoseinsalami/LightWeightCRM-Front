import {GenericType} from "../../_types/genericType.type";
import {EventTypesEnum} from "../../_enums/event-types-enum";
import {ActionTypesEnum} from "../../_enums/action-types.enum";
import {FilterGroup, IFilterParameters, ValuePathAccess} from "./filter.type";

export class CreateProcessType extends GenericType<CreateProcessType> {
  title?: string;
  description?: string;
  active?: boolean;
  // triggerEvent?: EventTypesEnum;
  triggerEvent?: string;
  actions?: IAppAction[];
  // actions?: ActionModel[];
  triggerCondition?: string;
  constructor(model?:Partial<CreateProcessType>) {
    super(model);
  }
}

export interface IAppAction {
  name?: string;
  actionParameters?: IActionParameter[]
}

export interface IActionParameter {
  field?: string;
  valueFormat?: string;
  filter?: FilterGroup;
  valueParameters?:ValuePathAccess[];
  type?: string;
}


export interface IProcessActionType{
  action?: string,
  label?: string
}

export interface IEventProcess{
  title?:string;
  filterParameter: IFilterParameters
}


export interface ActionModel {
  actionType?: ActionTypesEnum;
  input?: any;

}

export interface ChangeStep {
  stepId?: number;
  selectWorkItemCondition?: any
}

export interface SendSms {
  receiver?: string;
  content?: string;
  sendDateTime?: any;
}


export interface IEvent {
  caption?: string;
  entity?: string;
  name?: string;
}

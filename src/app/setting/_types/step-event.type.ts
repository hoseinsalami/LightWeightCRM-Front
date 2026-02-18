import {GenericType} from "../../_types/genericType.type";

export class CreateStepEventDTO extends GenericType<CreateStepEventDTO>{
  stepId?: number;  // زمان ساخت اونت برای گام مقدار میگیرد
  pathId?: number; // زمان ساخت اونت برای جریان مقدار میگیرد
  eventName?: string;
  actions?: CreateActionDTO[];
  constructor(model?: Partial<CreateStepEventDTO>) {
    super(model);

    if (model.actions){
      this.actions = model.actions.map(a => {return new CreateActionDTO(a)});
    }

  }
}
export class CreateActionDTO extends GenericType<CreateActionDTO>{
  name?: string;
  input?: any | string;
  constructor(model?: Partial<CreateActionDTO>) {
    super(model);
  }
}

export interface ISteps{
  id?: number;
  order?: number;
  title?: string;
}

export interface IStepUI extends ISteps {
  events: IStepEventUI[];
  selectedEventIndex?: number;
}


export interface IStepEvent{
  id?:number
  actionId?: number;
  eventId?: number;
  name?: string;
  title?: string;
}

// مدل سمت فرانت
export interface IStepEventUI extends IStepEvent {
  actions: IStepEventAction[];
}
export interface IStepEventAction {
  id?: number;
  eventId?: number;
  type: number;
  data: any;
}


export interface IPlaceHolders {
  caption?: string;
  name?: string;
}

// مدل های اکشن
export interface ChangeWorkItemStepActionUserInputDTO {
  stepId?: number;
}
export interface SendSmsToCustomerActionUserInputDTO {
  message?: string;
}

export interface CreateWorkItemActionInputDTO {
  title?: string;
  description?: string;
  pathId?: number;
  stepId?: number;
}
export enum StepEventActionTypeEnum {
  SendSms = 0,
  ChangeStep = 1,
  CreateWorkItem = 2,
  SendSurveyActionRequest
}

export const StepEventActionTypeEnum2LabelMapping : Record<StepEventActionTypeEnum,string> ={
  [StepEventActionTypeEnum.SendSms]: 'ارسال پیام',
  [StepEventActionTypeEnum.ChangeStep]: 'تغییر گام',
  [StepEventActionTypeEnum.CreateWorkItem]: 'ایجاد معامله در کاریز',
  [StepEventActionTypeEnum.SendSurveyActionRequest]: 'ارسال لینک نظرسنجی به مشتری',
}


export interface IGenericTitle{
  id?: number;
  title?: string;
}

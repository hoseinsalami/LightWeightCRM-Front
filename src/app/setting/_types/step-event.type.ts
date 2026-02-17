import {GenericType} from "../../_types/genericType.type";

export class CreateStepEventDTO extends GenericType<CreateStepEventDTO>{
  stepId?: number;
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
export enum StepEventActionType {
  SendSms = 0,
  ChangeStep = 1,
  CreateWorkItem = 2,
  SendSurveyActionRequest
}

export const StepEventActionTypeEnum2LabelMapping : Record<StepEventActionType,string> ={
  [StepEventActionType.SendSms]: 'ارسال پیام',
  [StepEventActionType.ChangeStep]: 'تغییر گام',
  [StepEventActionType.CreateWorkItem]: 'ایجاد معامله در کاریز',
  [StepEventActionType.SendSurveyActionRequest]: 'ارسال لینک نظرسنجی به مشتری',
}

export enum EventTypesEnum {
  WorkItemChangeStep,
  WorkItemChangeStatus,
  ReceiveSMS
}

export const EventTypesEnum2LabelMapping : Record<EventTypesEnum, string> = {
  [EventTypesEnum.WorkItemChangeStep]: 'تغییر گام قلم کاری',
  [EventTypesEnum.WorkItemChangeStatus]: 'تغییر وضعیت قلم کاری',
  [EventTypesEnum.ReceiveSMS]: 'دریافت پیامک',
}

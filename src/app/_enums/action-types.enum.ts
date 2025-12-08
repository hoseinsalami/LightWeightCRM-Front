export enum ActionTypesEnum {
  WorkItemChangeStep,
  SendSMS,
  CreateActivity
}

export const ActionTypesEnumEnum2LabelMapping : Record<ActionTypesEnum, string> = {
  [ActionTypesEnum.WorkItemChangeStep] : 'تغییر گام قلم کاری',
  [ActionTypesEnum.SendSMS] : 'ارسال پیامک',
  [ActionTypesEnum.CreateActivity] : 'ایجاد فعالیت',
}

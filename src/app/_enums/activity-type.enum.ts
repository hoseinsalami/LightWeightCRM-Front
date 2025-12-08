export enum ActivityTypeEnum {
  Delayed,
  SpecialService,
  Complaint
}

export const ActivityTypeEnum2LabelMapping : Record<ActivityTypeEnum, string> = {
  [ActivityTypeEnum.Delayed]: 'تاخیر خورده',
  [ActivityTypeEnum.SpecialService]: 'سرویس ویژه',
  [ActivityTypeEnum.Complaint]: 'شکایت',
}

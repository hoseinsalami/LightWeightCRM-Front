export enum TimeUnitsEnum{
  Minute,
  Hour,
  Day
}

export const TimeUnitsEnum2LabelMapping: Record<TimeUnitsEnum, string> = {
  [TimeUnitsEnum.Minute] : 'دقیقه',
  [TimeUnitsEnum.Hour] : 'ساعت',
  [TimeUnitsEnum.Day] : 'روز',
}

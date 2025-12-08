export enum ReportDimensionEnum {
  Employee,
  Customer,
  Hour,
  Day,
  Month,
  Year,
  TicketState,
  TicketType,
}

export const ReportDimensionEnum2LabelMapping : Record<ReportDimensionEnum, string> = {
  [ReportDimensionEnum.Employee]: 'کارشناس',
  [ReportDimensionEnum.Customer]: 'مشتری',
  [ReportDimensionEnum.Hour]: 'ساعت',
  [ReportDimensionEnum.Day]: 'روز',
  [ReportDimensionEnum.Month]: 'ماه',
  [ReportDimensionEnum.Year]: 'سال',
  [ReportDimensionEnum.TicketState]: 'وضعیت تیکت',
  [ReportDimensionEnum.TicketType]: 'نوع تیکت',
}

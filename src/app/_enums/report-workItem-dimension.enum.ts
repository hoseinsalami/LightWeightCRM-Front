

export enum ReportWorkItemDimensionEnum {
  Path,
  Step,
  Customer,
  CurrentUser,
  Admin,
  Status,
  FailureReason,
  CreateHour,
  CreateDay,
  CreateMonth,
  CreateYear,
  FinishHour,
  FinishDay,
  FinishMonth,
  FinishYear,
}

export const ReportWorkItemDimensionEnum2LabelMapping : Record<ReportWorkItemDimensionEnum, string> = {
  [ReportWorkItemDimensionEnum.Path]: 'کاریز',
  [ReportWorkItemDimensionEnum.Step]: 'گام',
  [ReportWorkItemDimensionEnum.Customer]: 'مشتری',
  [ReportWorkItemDimensionEnum.CurrentUser]: 'کارشناس',
  [ReportWorkItemDimensionEnum.Admin]: 'راهبر',
  [ReportWorkItemDimensionEnum.Status]: 'وضعیت',
  [ReportWorkItemDimensionEnum.FailureReason]: 'دلیل شکست',
  [ReportWorkItemDimensionEnum.CreateHour]: 'زمان ایجاد(ساعت)',
  [ReportWorkItemDimensionEnum.CreateDay]: 'زمان ایجاد(روز)',
  [ReportWorkItemDimensionEnum.CreateMonth]: 'زمان ایجاد(ماه)',
  [ReportWorkItemDimensionEnum.CreateYear]: 'زمان ایجاد(سال)',
  [ReportWorkItemDimensionEnum.FinishHour]: 'زمان اتمام(ساعت)',
  [ReportWorkItemDimensionEnum.FinishDay]: 'زمان اتمام(روز)',
  [ReportWorkItemDimensionEnum.FinishMonth]: 'زمان اتمام(ماه)',
  [ReportWorkItemDimensionEnum.FinishYear]: 'زمان اتمام(سال)',
}

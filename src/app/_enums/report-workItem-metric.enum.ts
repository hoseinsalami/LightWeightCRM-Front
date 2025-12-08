export enum ReportWorkItemMetricEnum{
  Count,
  AverageDuration
}

export const ReportWorkItemMetricEnum2LabelMapping : Record<ReportWorkItemMetricEnum, string> = {
  [ReportWorkItemMetricEnum.Count]: 'تعداد',
  [ReportWorkItemMetricEnum.AverageDuration]: 'متوسط دوره زمانی معاملات',
}

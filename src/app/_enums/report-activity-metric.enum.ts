export enum ReportActivityMetricEnum{
  Count,
  AverageDuration
}

export const ReportActivityMetricEnum2LabelMapping : Record<ReportActivityMetricEnum, string> = {
  [ReportActivityMetricEnum.Count]: 'تعداد',
  [ReportActivityMetricEnum.AverageDuration]: 'متوسط دوره زمانی فعالیت ها',
}

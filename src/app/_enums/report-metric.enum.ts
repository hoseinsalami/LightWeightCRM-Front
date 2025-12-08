

export enum ReportMetricEnum {
  TicketCount,
  AvgWaitTime,
  AvgResponseTime
}

export const ReportMetricEnum2LabelMapping : Record<ReportMetricEnum, string> = {
  [ReportMetricEnum.TicketCount]: 'تعداد تیکت',
  [ReportMetricEnum.AvgWaitTime]: 'مدت زمان انتظار',
  [ReportMetricEnum.AvgResponseTime]: 'مدت زمان پاسخگویی',
}

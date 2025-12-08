export enum TicketTypeEnum {
  Delayed,
  SpecialService,
  Complaint,
  Audit
}

export const TicketTypeEnum2LabelMapping : Record<TicketTypeEnum, string> = {
  [TicketTypeEnum.Delayed]: 'تاخیر خورده',
  [TicketTypeEnum.SpecialService]: 'سرویس ویژه',
  [TicketTypeEnum.Complaint]: 'شکایت',
  [TicketTypeEnum.Audit]: 'پیگیری',
}

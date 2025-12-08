export enum TicketStateEnum {
  New,
  Current,
  Closed
}

export const TicketStateEnum2LabelMapping : Record<TicketStateEnum, string> ={
  [TicketStateEnum.New]: 'جدید',
  [TicketStateEnum.Current]: 'جاری',
  [TicketStateEnum.Closed]: 'بسته شده',
}

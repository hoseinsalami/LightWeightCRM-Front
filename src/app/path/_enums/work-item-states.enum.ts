export enum WorkItemStatesEnum{
  New,
  Successful,
  Failed
}

export const WorkItemStatesEnum2LabelMapping: Record<WorkItemStatesEnum, string> = {
  [WorkItemStatesEnum.New]: 'جدید',
  [WorkItemStatesEnum.Successful]: 'بسته شد',
  [WorkItemStatesEnum.Failed]: 'موفق نشد',
}

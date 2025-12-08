export enum WorkItemChangeLogTypesEnum {
  ChangeStep,
  ChangeStatus,
  ChangeUser
}


export const WorkItemChangeLogTypesEnum2LableMapping : Record<WorkItemChangeLogTypesEnum, string> = {
  [WorkItemChangeLogTypesEnum.ChangeStep]: 'تغییر گام',
  [WorkItemChangeLogTypesEnum.ChangeStatus]: 'تغییر وضعیت',
  [WorkItemChangeLogTypesEnum.ChangeUser]: 'تغییر کارشناس',
}

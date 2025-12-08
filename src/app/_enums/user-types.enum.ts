export enum UserTypesEnum {
  Expert,
  Admin,
  SuperAdmin,
  SystemAdmin
}


export const UserTypesEnum2LabelMapping: Record<UserTypesEnum, string> ={
  [UserTypesEnum.Expert] : 'کارشناس',
  [UserTypesEnum.Admin] : 'راهبر',
  [UserTypesEnum.SuperAdmin] : 'راهبر ارشد',
  [UserTypesEnum.SystemAdmin] : 'ادمین سیستم',
}

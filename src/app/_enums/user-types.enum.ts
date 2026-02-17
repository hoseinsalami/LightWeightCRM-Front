export enum UserTypesEnum {
  // None = 0,
  Expert = 1,
  Admin = 2,
  SuperAdmin = 4,
  SystemAdmin = 8
}


export const UserTypesEnum2LabelMapping: Record<UserTypesEnum, string> ={
  // [UserTypesEnum.None] : 'هیچکدام',
  [UserTypesEnum.Expert] : 'کارشناس',
  [UserTypesEnum.Admin] : 'راهبر',
  [UserTypesEnum.SuperAdmin] : 'راهبر ارشد',
  [UserTypesEnum.SystemAdmin] : 'ادمین سیستم',
}

import {UserTypesEnum} from "../_enums/user-types.enum";

export interface LoginOutputType {
    id?:number;
    fullName?: string;
    lastLoginTime?: string;
    lastLoginIp?: string;
    permissions?: string[];
    token?:string;
    userType?: UserTypesEnum;
    notifications: NotificationsType[]
}

export interface LoginOutputSscrmType{
  id?:number
  fullName?: string,
  lastLogin?: string;
  token?:string;
  userType?: UserTypesEnum;
  username?: string;
  permissions?: string[];
  tenant?: string;
}

export interface NotificationsType {
  id?: number;
  createTime?: any;
  message?: string;

}

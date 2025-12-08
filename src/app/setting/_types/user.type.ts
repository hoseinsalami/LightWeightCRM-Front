import {GenericType} from "../../_types/genericType.type";
import {UserTypesEnum} from "../../_enums/user-types.enum";

export class UserTypeBase extends GenericType<UserTypeBase>{

  fullName?: string;
  mobile?: string;
  userName?: string;
  userType?:UserTypesEnum;
  active?: boolean;
}

export class UserTypeCreate extends UserTypeBase {
  password?: string;
  pathIds:number[];

  constructor(model?: Partial<UserTypeCreate>) {
    super(model);
    if (!model.pathIds)
      this.pathIds=[];
  }

}

export class UserTypeList extends UserTypeBase {
  constructor(model?: Partial<UserTypeList>) {
    super(model);
  }

}

export class UserTypeUpdate extends UserTypeCreate {
  userPaths:UserPath[];
  constructor(model?: Partial<UserTypeUpdate>) {
    super(model);

    if (model?.userPaths){
      this.userPaths = model.userPaths.map(i => {
        return new UserPath(i)
      });
    } else {
      this.userPaths = [];
    }
  }

}

export class UserTypeDetail extends UserTypeUpdate {

  constructor(model?: Partial<UserTypeDetail>) {
    super(model);
  }

}

export class UserPath extends GenericType<UserPath>{
  userId?:number;
  pathId?:number;
  constructor(model:Partial<UserPath>) {
    super(model);
  }
}

export  interface UserInfo {
  fullName?: string;
  mobile?: string;
  userName?: string;
  userType?:UserTypesEnum
}

import {GenericType} from "./genericType.type";
import {WorkItemChangeLogTypesEnum} from "../_enums/workItem-change-log-types.enum";
import {UserTypeBase} from "../setting/_types/user.type";

export class ChangeLogType extends GenericType<ChangeLogType> {

  logType?: WorkItemChangeLogTypesEnum;
  changeUser?: UserTypeBase;
  dateTime?: string;
  description?: string;

  constructor(model?: Partial<ChangeLogType>) {
    super(model);

    if (model.changeUser){
      this.changeUser = new UserTypeBase(model.changeUser)
    } else {
      this.changeUser = new UserTypeBase({})
    }

  }
}

// export class UserDropDownListDTO extends GenericType<UserDropDownListDTO> {
//   fullName?:string
//   constructor(model?:Partial<UserDropDownListDTO>) {
//     super(model);
//   }
// }

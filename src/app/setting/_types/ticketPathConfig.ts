import {GenericType} from "../../_types/genericType.type";
import {TimeUnitsEnum} from "../../_enums/TimeUnits.enum";
import {UserTypeBase} from "./user.type";

export class TicketPathConfig extends GenericType<TicketPathConfig> {
  title?: string;
  stepId?: number;
  deadlineValue?: number;
  periodTimeUnit?: TimeUnitsEnum;
  adminId?: number;
  expertIds?: number[];
  userExpert?: UserTypeBase;

  constructor(model?: Partial<TicketPathConfig>) {
    super(model);

    if (model.userExpert){
      this.userExpert = new UserTypeBase(model.userExpert)
    }

  }
}

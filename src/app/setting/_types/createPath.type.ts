import {GenericType} from "../../_types/genericType.type";
import {PathAssignmentPoliciesEnum} from "../../_enums/path-assignment-policies.enum";
import {UserTypeBase} from "./user.type";
import {TimeUnitsEnum} from "../../_enums/TimeUnits.enum";
import {deg} from "html2canvas/dist/types/css/types/angle";

export class CreatePathType extends GenericType<CreatePathType>{

  title?: string;
  description?: string;
  assignmentPolicy?: PathAssignmentPoliciesEnum;
  steps?: CreateStepType[];
  pathAdminId?: number;
  pathExpertIds?: number[];
  pathAdmin?: UserTypeBase;
  pathExperts?: UserTypeBase[];
  constructor(model?: Partial<CreatePathType>) {
    super(model);

    if (model?.steps){
      this.steps = model.steps.map(i =>{ return new CreateStepType(i)})
    } else {
      this.steps = [];
    }

    if (model?.pathAdmin){
      this.pathAdmin = new UserTypeBase(model?.pathAdmin)
    }

    if (model?.pathExperts){
      this.pathExperts = model.pathExperts.map(e => {return new UserTypeBase(e)})
    } else {
      this.pathExperts = [];
    }

  }
}

export class UpdatePathType extends CreatePathType {
  constructor(model?:Partial<UpdatePathType>) {
    super(model);

    // if (model?.pathAdmin){
    //   this.pathAdminId = model?.pathAdmin.id
    // }
    //
    // if (model?.pathExperts){
    //   debugger
    //   this.pathExpertIds = model.pathExperts.map(e => {return e.id})
    // } else {
    //   this.pathExperts = [];
    // }

  }
}

export class CreateStepType extends GenericType<CreateStepType>{
  title?: string;
  caption?: string;
  order?: number;
  deadlineValue?: number;
  periodTimeUnit?: TimeUnitsEnum
  constructor(model: Partial<CreateStepType>) {
    super(model);
  }
}

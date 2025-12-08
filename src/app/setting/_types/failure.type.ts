import {GenericType} from "../../_types/genericType.type";

export class FailureTypeList extends GenericType<FailureTypeList>{

  title?: string;
  constructor(model?: Partial<FailureTypeList>) {
    super(model);
  }
}

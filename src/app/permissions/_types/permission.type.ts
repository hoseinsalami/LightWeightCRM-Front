import {GenericType} from "../../_types/genericType.type";

export class PermissionTypeDTO extends GenericType<PermissionTypeDTO>{
  name?: string;
  title?: string;
  constructor(model?: Partial<PermissionTypeDTO>) {
    super(model);
  }
}



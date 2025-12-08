import {GenericType} from "../../_types/genericType.type";

export class CreateTenantDTO extends GenericType<CreateTenantDTO>{
  name?: string;
  dbName?: string;
  description?: string;
  disable?: boolean;

  fullName?: string;
  userName?: string;
  password?: string;
  permissionIds?: number[]
  constructor(model?: Partial<CreateTenantDTO>) {
    super(model);
    if (model.disable) {
      this.disable = model.disable;
    } else {
      this.disable = false;
    }

    if (!model.permissionIds)
      this.permissionIds=[];

  }

}

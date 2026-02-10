import {GenericType} from "../../../_types/genericType.type";

export class CreateSmsProviderDTO extends GenericType<CreateSmsProviderDTO>{
  title?: string;
  code?: string;
  constructor(model?: Partial<CreateSmsProviderDTO>) {
    super(model);
  }

}

import {GenericType} from "../../_types/genericType.type";

export class SmsProviderType extends GenericType<SmsProviderType>{
  tenantId?: number;
  smsProviderId?: number;
  isDefault?: boolean;
  apiKey?: string;
  phoneNumber?: string;
  constructor(model?: Partial<SmsProviderType>) {
    super(model);
  }

}

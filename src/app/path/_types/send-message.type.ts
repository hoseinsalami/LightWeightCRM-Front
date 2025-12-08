import {MessagingPlatformEnum} from "../_enums/messaging-platform.enum";

export interface SendMessageType {
  platform?: MessagingPlatformEnum;
  message?: string;
  phoneNumber?: string;
  customerId?: number;
  workItemId?: number;
  sendDateTime?:string;
}

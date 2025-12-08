export enum MessagingPlatformEnum{
  Sms,
  Telegram,
  WhatsApp,
  Email
}

export const MessagingPlatformEnum2LabelMapping: Record<MessagingPlatformEnum, string> = {
  [MessagingPlatformEnum.Sms]: 'پیامک',
  [MessagingPlatformEnum.Telegram]: 'Telegram',
  [MessagingPlatformEnum.WhatsApp]: 'WhatsApp',
  [MessagingPlatformEnum.Email]: 'Email',
}

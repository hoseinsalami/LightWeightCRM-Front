export  enum NoticeStatesEnum {
  FirstNotice,
  SecondNotice,

  /// <summary>
  /// درخواست توقیف
  /// </summary>
  DetentionRequest,


  /// <summary>
  /// توقیف
  /// </summary>
  Detention,

  //SendToCourt,
  //AddressNotIdentified,
  /// <summary>
  /// رفع نقض
  /// </summary>
  FixDefect,

  /// <summary>
  /// اسقاط
  /// </summary>
  Abortion

}

export const NoticeStates2LabelMapping: Record<NoticeStatesEnum, string> = {
    [NoticeStatesEnum.FirstNotice]: "اخطاریه اول",
    [NoticeStatesEnum.SecondNotice]: "اخطاریه دوم",
    [NoticeStatesEnum.DetentionRequest]: "درخواست توقیف",
    [NoticeStatesEnum.Detention]: "توقیف",
    [NoticeStatesEnum.FixDefect]: "رفع نقص",
    [NoticeStatesEnum.Abortion]: "اسقاط",
}

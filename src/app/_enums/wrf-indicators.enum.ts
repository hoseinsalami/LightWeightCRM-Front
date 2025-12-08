export enum WrfIndicatorsEnum
{
    Temperature=1,
    Temperature2Meter,
    Rain,
    Snow,
    Cloud,
    Pressure,
    SnowH
    //QVAPOR
}

export const WrfIndicatorsEnum2LabelMapping: Record<WrfIndicatorsEnum, string> = {
    [WrfIndicatorsEnum.Temperature]: "دما",
    [WrfIndicatorsEnum.Temperature2Meter]: "دمای 2 متری",
    //[WrfIndicatorsEnum.QVAPOR]: "بخار آب",
    [WrfIndicatorsEnum.Cloud]: "میزان ابرناکی",
    [WrfIndicatorsEnum.Rain]: "بارش",
    [WrfIndicatorsEnum.Snow]: "برف",
    [WrfIndicatorsEnum.Pressure]: "فشار هوا",
    [WrfIndicatorsEnum.SnowH]: "ارتفاع برف",
}

export const WrfIndicatorsEnum2UnitLabelMapping: Record<WrfIndicatorsEnum, string> = {
    [WrfIndicatorsEnum.Temperature]: "سانتیگراد",
    [WrfIndicatorsEnum.Temperature2Meter]: "سانتیگراد",
    //[WrfIndicatorsEnum.QVAPOR]: "بخار آب",
    [WrfIndicatorsEnum.Cloud]: "%",
    [WrfIndicatorsEnum.Rain]: "میلیمتر",
    [WrfIndicatorsEnum.Snow]: "سانتیمتر",
    [WrfIndicatorsEnum.Pressure]: "mbar",
    [WrfIndicatorsEnum.SnowH]: "سانتیمتر",
}

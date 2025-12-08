export enum TimeUnitsEnum {
    Hourly = 0,
    Daily = 1,
    Monthly = 2,
    Annual = 3,
    ArbitraryByDay = 4,
}

// optional: Record type annotation guaranties that
// all the values from the enum are presented in the mapping
export const TimeUnitsEnum2LabelMapping: Record<TimeUnitsEnum, string> = {
    [TimeUnitsEnum.Hourly]: "ساعتی",
    [TimeUnitsEnum.Daily]: "روزانه",
    [TimeUnitsEnum.Monthly]: "ماهیانه",
    [TimeUnitsEnum.Annual]: "سالیانه",
    [TimeUnitsEnum.ArbitraryByDay]: "دلخواه",
}

export enum DefinitionTypesEnum
{
    TechnicalDiagnosisCenter = 0,

    MovingAirPollution_SourceCategory,
    FixedAirPollution_SourceType,

    ElectroMagneticPollution_SourceType,
    ElectroMagneticPollution_OperatorName,

    LightPollution_SourceType,
    LightPollution_PollutionPlace,

    SoundPollution_UsageType,

    WaterPollution_UsageType,
    WasteWaterPollution_UsageType
}

export const DefinitionTypesEnum2LabelMapping: Record<DefinitionTypesEnum, string> = {
    [DefinitionTypesEnum.TechnicalDiagnosisCenter]: "مراکز معاینه فنی",
    [DefinitionTypesEnum.MovingAirPollution_SourceCategory]: "نوع سوخت",
    [DefinitionTypesEnum.FixedAirPollution_SourceType]: "نوع منبع (آلاینده های ثابت هوا)",
    [DefinitionTypesEnum.ElectroMagneticPollution_SourceType]: "نوع منبع (آلاینده های الکترومغناطیسی)",
    [DefinitionTypesEnum.ElectroMagneticPollution_OperatorName]: "نام اپراتور (آلاینده های الکترومغناطیسی)",
    [DefinitionTypesEnum.LightPollution_SourceType]: "نوع منبع (آلاینده های نوری)",
    [DefinitionTypesEnum.LightPollution_PollutionPlace]: "محل آلودگی (آلاینده های نوری)",
    [DefinitionTypesEnum.SoundPollution_UsageType]: "نوع کاربری (آلاینده های صوتی)",
    [DefinitionTypesEnum.WaterPollution_UsageType]: "نوع کاربری (آلاینده های آب)",
    [DefinitionTypesEnum.WasteWaterPollution_UsageType]: "نوع کاربری (آلاینده های فاضلاب)",
}

export const DefinitionTypesEnum2RouteMapping: Record<DefinitionTypesEnum, string> = {
    [DefinitionTypesEnum.TechnicalDiagnosisCenter]: "TechDiagCenters",
    [DefinitionTypesEnum.MovingAirPollution_SourceCategory]: "MapSourceCategory",
    [DefinitionTypesEnum.FixedAirPollution_SourceType]: "FapSourceType",
    [DefinitionTypesEnum.ElectroMagneticPollution_SourceType]: "EmpSourceType",
    [DefinitionTypesEnum.ElectroMagneticPollution_OperatorName]: "EmpOperatorName",
    [DefinitionTypesEnum.LightPollution_SourceType]: "LpSourceType",
    [DefinitionTypesEnum.LightPollution_PollutionPlace]: "LpPollutionPlace",
    [DefinitionTypesEnum.SoundPollution_UsageType]: "SpUsageType",
    [DefinitionTypesEnum.WaterPollution_UsageType]: "WpUsageType",
    [DefinitionTypesEnum.WasteWaterPollution_UsageType]: "WwpUsageType",
}

export const Route2DefinitionTypesEnumMapping: Record<string, DefinitionTypesEnum> = {
    "TechDiagCenters":DefinitionTypesEnum.TechnicalDiagnosisCenter,
     "MapSourceCategory":DefinitionTypesEnum.MovingAirPollution_SourceCategory,
     "FapSourceType":DefinitionTypesEnum.FixedAirPollution_SourceType,
    "EmpSourceType":DefinitionTypesEnum.ElectroMagneticPollution_SourceType,
     "EmpOperatorName":DefinitionTypesEnum.ElectroMagneticPollution_OperatorName,
    "LpSourceType":DefinitionTypesEnum.LightPollution_SourceType,
    "LpPollutionPlace":DefinitionTypesEnum.LightPollution_PollutionPlace,
    "SpUsageType":DefinitionTypesEnum.SoundPollution_UsageType,
    "WpUsageType":DefinitionTypesEnum.WaterPollution_UsageType,
    "WwpUsageType":DefinitionTypesEnum.WasteWaterPollution_UsageType,
}


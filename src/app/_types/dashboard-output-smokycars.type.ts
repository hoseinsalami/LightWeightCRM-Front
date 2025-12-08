export interface DashboardOutputSmokycarsType{
  currentYearTotalNotices?:    number;
  currentYearTotalFixDefect?:  number; // رفع نقص
  fixDefectAverageTime?:       number;
  currentMonthTotalNotices?:   number;
  currentMonthTotalFixDefect?: number;
  carFrequencies?:             CarFrequency[];
  befor15DayFixDetect?:        number;
  after15DayFixDetect?:        number;
}

export interface CarFrequency {
  carType?: CarType;
  count?:   number;
}

export interface CarType {
  id?:    number;
  title?: string;
}

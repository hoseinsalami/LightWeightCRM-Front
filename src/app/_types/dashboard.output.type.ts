import {GenericType} from "./genericType.type";

export class DashboardTypeBase extends GenericType<DashboardTypeBase>{
  otherPaths?: baseType[];
  ticketPaths?: baseType[];

  constructor(model?: Partial<DashboardTypeBase>) {
    super(model);

    if (model.otherPaths){
      this.otherPaths = model.otherPaths.map(o => {return new baseType(o)})
    }

    if (model.ticketPaths){
      this.ticketPaths = model.ticketPaths.map(t => {return new baseType(t)})
    }

  }
}

export class baseType extends GenericType<baseType>{
  title?: string;
  newTicketCount?: number;
  ticketType?: number;
  constructor(model?:Partial<baseType>) {
    super(model);
  }

}


export interface DashboardOutputType{
  airQualityInfo : AirQualityInfo;
  weatherInfo: WeatherInfo;
  stationsFullInfo : StationsInfo[];

}

export interface AirQualityInfo {
  aqi?: number;
  dateTime?:any;
  influentialIndicator?: string;
  instantAQI?:number;
  past24HourAQI?: number;
}

export interface WeatherInfo {
  dateTime?:any;
  humadity?:number;
  pressure?:number;
  rain?:number;
  temprature?:number;
  uv?:number;
  windDirection?:number;
  windSpeed?:number;
}

export interface StationsInfo {
  airQualityMeasurement : AirQualityMeasurement;
  station: Station;
  weatherMeasurement: WeatherMeasurement;
}

export interface AirQualityMeasurement{
  aqi?:number;
  instant_AQI?:number;
  influentialIndicator?:string;
  dateTime?:any;
}

export interface Station{
  active?: boolean;
  title?: string;
  lat?: number;
  lng?: number;
}

export interface WeatherMeasurement{
  dateTime?:string;
  rlev?:number;
  tc?:number;
  ws?:number;
}

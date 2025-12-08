export interface ChartValueLabelPair<T>{
    label?:string;
    value?:T
}

export interface ChartData<T>{
    labels:string[];
    values:T[];
}

export interface SingleSeries{
    label:string;
    color: string;
    values:number[];
}

// import {ChartData, ChartValueLabelPair, SingleSeries} from "../monitor/_types/chart-output-types";
import {WrfIndicatorsEnum} from "../_enums/wrf-indicators.enum";
import {ChartData, SingleSeries} from "../_types/chart-output-types";

export  class Utilities {
  public static StringIsNumber = value => isNaN(Number(value)) === false;

    public static ConvertEnumToArrayValue(inputEnum: any, mapping: any) {
        return Object.keys(inputEnum)
            .filter(this.StringIsNumber)
            .map(key => mapping[key]);
    }

    public static ConvertEnumToKeyPairArray(inputEnum: any, mapping: any) {
        return Object.keys(inputEnum)
            .filter(this.StringIsNumber)
            .map(key =>{ return {title: mapping[key], value: +key} });
    }

    public static FindInArray(inputArr: any[],fieldName:string ,findVal: any) {
        let i = inputArr.findIndex(x=> this.getValue(x, fieldName) == findVal);
        if(i !== -1){
            return inputArr[i];
        }
        return  undefined;

    }


  // public static ConvertEnumFromString<T>(value: string): T | undefined {
  //   return (T as any)[value as keyof typeof T];
  // }

    static getColorByValue(data: number[],
                           redCallback: (n: number) => number,
                           greenCallback: (n: number) => number,
                           blueCallback: (n: number) => number) {
        const colors = [];
        const maxUVIntensity = Math.max(...data);
        const minUVIntensity = Math.min(...data);
        const range = maxUVIntensity ;//- minUVIntensity;

        data.forEach(value => {
            const normalizedValue = (value) / range;
            const red = redCallback(normalizedValue)//255;
            const green = greenCallback(normalizedValue)//Math.floor(255 * (1 - normalizedValue));
            const blue = blueCallback(normalizedValue);
            const color = `rgba(${red}, ${green}, ${blue}, 0.6)`;
            colors.push(color);
        });

        return colors;
    }

    // static convertToChartData(seriesData: SingleSeries[], colorfn:(data:number[], otherData:any)=>any[], colorfnOtherData:any) {
    //     return seriesData.map((value) => {
    //         return {
    //             label: value.label,
    //             data: value.values,
    //             backgroundColor: colorfn(value.values, colorfnOtherData)
    //         }
    //     });
    // }

    static convertToChartData(chartData:ChartData<SingleSeries>,
                              colorfn:(data:number[], dataLabel:string, otherData:any)=>any[] = undefined,
                              colorfnOtherData:any = undefined,
                              borderColorfn:(data:number[], dataLabel:string, otherData:any)=>any[] = undefined,
                              borderColorfnOtherData:any = undefined) {
        return {
            labels: chartData.labels,
            datasets: chartData.values.map((value) => {
                return {
                    label: value.label,
                    data: value.values,
                    backgroundColor: colorfn != undefined ? colorfn(value.values, value.label, colorfnOtherData) : [],
                    borderColor:borderColorfn != undefined ? borderColorfn(value.values, value.label, borderColorfnOtherData) : [],
                }
            })
        };
    }

    // public static ConvertEnumToKeyPairs(inputEnum: any, mapping: any) {
    //     return Object.keys(inputEnum)
    //         .map(key =>{ return {title: mapping[key], value: key}});
    // }

    static getValue<T, K extends keyof T>(data: T, key: K) {
        return data[key];
    }
}

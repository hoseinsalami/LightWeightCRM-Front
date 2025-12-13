import {GenericType} from "../../_types/genericType.type";

export class CreateFilterDTO extends GenericType<CreateFilterDTO>{
  title?: string;
  entity?: string
  description?: string;
  filter?: FilterGroup;
  parameters?: ParameterGroup;
  constructor(model?: Partial<CreateFilterDTO>) {
    super(model);

    if (model?.filter) {
      this.filter = { ...model.filter };
    }

  }

}

export interface IEntities {
  entity?: string,
  title?: string
}

export interface FieldFilterDescriptor {
  field?: string;
  type?: string;
  label?: string;
  realType?: string;
  filterParameter?: IFilterParameters[];
  subFields?: FieldFilterDescriptor[];
}

export interface IFilterParameters {
  filter?: FilterGroup
  parameters?: ParameterGroup[]
}

export interface FilterGroup {
  label?: string;
  filters?: FilterField[];
  logic?: string;
  entity?:string;
}

export interface FilterField {
  field?: string;
  logic?: string;
  type?: string;
  mode?:string;
  conditions?: FilterCondition[]
  filters?: FilterGroup[]
}

export interface FilterCondition {
  operator?: string;
  value?: string;
  parameter?: string;
  valuePath?: ValuePathAccess;
}

export interface ParameterGroup {
  name?: string;
  label?: string;
}

export interface ValuePathAccess {
  path?: string;
  field?: string;
  filter?:FilterGroup
}

// export interface FieldOptionItem {
//   label: string;
//   mode?: string; // for array
//   filters: Record<string, FilterItem[]>;
// }
//
// // شرایط فیلتر
// export interface FilterItem {
//   matchMode: string;
//   operator: string;
//   value: string | number | boolean;
//   mode?: string;
//   fields?: string;
// }

// گزینه‌ها برای فیلدهایی که نوع object دارند




// مقدار فیلدهایی که شیء یا آرایه هستند
export interface ObjectValue {
  type: 'object' | 'array';
  // options: OptionItem[];
}

export interface BaseFieldValue {
  type: 'string' | 'object' | 'array';
  label: string;
  // filters?: OptionItem[];
}

// مقدار هر فیلد می‌تواند:
// ۱. یک رشته
// ۵. یک آبجکت با ساختار مشخص
export type FieldValue =BaseFieldValue
  // | string
  // | ObjectValue;

// ساختار اصلی بدون کلیدهای ثابت
export type DynamicData = Record<string, FieldValue>;
// export type ConditionsMap = { [field: string]: FilterCondition[]; };

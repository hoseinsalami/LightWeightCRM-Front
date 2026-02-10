import {GenericType} from "../../_types/genericType.type";

export class DocumentModelType extends GenericType<DocumentModelType>{

  title?: string;
  name?: string;
  properties?: CreatePropertyDTO[]

  constructor(model: Partial<DocumentModelType>) {
    super(model);

    if (model.properties){
      this.properties = model.properties.map(item => {return new CreatePropertyDTO(item)});
    }

  }
}

export class CreatePropertyDTO extends GenericType<CreatePropertyDTO>{
  title?: string;
  name?: string;
  propertyType?: PropertyTypeEnum;
  descriptor?: string;
  isMandatory?: boolean;
  defaultValue?: string;
  showInList?: boolean;
  isCaption?: boolean;
  value?: string;

  constructor(model?: Partial<CreatePropertyDTO>) {
    super(model);
  }

}

export enum PropertyTypeEnum {
  Number,
  ShortString,
  LongString,
  Bool,
  SingleSelect,
  MultiSelect,
  Date,
  /// <summary>
  /// نوع داکیومنت در فیلد توصیف کننده ذخیره میشود
  /// </summary>
  Document,
}

export const PropertyTypeEnum2LabelMapping: Record<PropertyTypeEnum, string> = {
  [PropertyTypeEnum.Number]: 'عددی',
  [PropertyTypeEnum.ShortString]: 'متن کوتاه',
  [PropertyTypeEnum.LongString]: 'متن طولانی',
  [PropertyTypeEnum.Bool]: 'Boolean',
  [PropertyTypeEnum.SingleSelect]: 'تک انتخابی',
  [PropertyTypeEnum.MultiSelect]: 'چند انتخابی',
  [PropertyTypeEnum.Date]: 'تاریخ',
  [PropertyTypeEnum.Document]: 'سند',
}



export interface ICreatDocumentInstance{
  customerId?:number;
  documentId?:number;
  propertiesValue?: IModifyInstancePropertyValueDTO[]
}

export interface IModifyInstancePropertyValueDTO {
  propertyId?: number;
  value?: string;
}

// جزییات اطلاعات سند
export interface IDetailDocInstance{
  id?:number;
  propertiesValue?: IPropertiesValueDoc[]
}

export interface IPropertiesValueDoc{
  property?: CreatePropertyDTO;
  value?: string
}

// آپدیت جزییات سند
export interface IUpdateDocInstance {
  documentInstanceId?: number;
  propertiesValue?: IModifyInstancePropertyValueDTO[]
}

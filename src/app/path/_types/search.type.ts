import {GenericType} from "../../_types/genericType.type";
import {CreateCustomerPhone} from "./create-work-item.type";

export class SearchType {
  activities?: TextSearchType[];
  customers?: TextSearchType[];
  workItems?: TextSearchType[];

  constructor(model?: Partial<SearchType>) {
    if (model.activities){
      this.activities = model.activities.map(a => {
        return new TextSearchType(a)
      })
    }

    if (model.customers){
      this.customers = model.customers.map(c => {
        return new TextSearchType(c)
      })
    }

    if (model.workItems){
      this.workItems = model.workItems.map(w => {
        return new TextSearchType(w)
      })
    }

  }
}

export class TextSearchType extends GenericType<TextSearchType>{
  extraInfo?: IExtraInfo;
  title?: string;

  constructor(model?: Partial<TextSearchType>) {
    super();
  }
}

export interface IExtraInfo{
  customerFullName?: string;
  isCustomer?: boolean;
  phones?:CreateCustomerPhone[]
}

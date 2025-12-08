import {GenericType} from "../../_types/genericType.type";

export class DoneActivityType extends GenericType<DoneActivityType>{
  result?: string;

  constructor(model?:Partial<DoneActivityType>) {
    super(model);
  }

}

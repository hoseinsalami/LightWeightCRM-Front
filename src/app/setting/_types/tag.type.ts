import {GenericType} from "../../_types/genericType.type";

export class TagTypeBase extends GenericType<TagTypeBase>{
  title?: string;
  color?: string;

  constructor(model?: Partial<TagTypeBase>) {
    super(model);
  }
}

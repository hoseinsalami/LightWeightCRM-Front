import {GenericType} from "../../_types/genericType.type";

export class EventTypeBase extends GenericType<EventTypeBase>{
  name?: string;
  caption?: string;
  entity?: string;
  constructor(model?: Partial<EventTypeBase>) {
    super(model);
  }
}

import {GenericType} from "../../_types/genericType.type";

export class ActivityType extends GenericType<ActivityType>{

  title?: string;
  iconClass?: string;
  defaultDuration?: number;

  constructor(model?: Partial<ActivityType>) {
    super(model);
  }
}

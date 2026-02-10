import {GenericType} from "../../_types/genericType.type";
import {IAppAction} from "./CreateProcess.type";

export class AgentType extends GenericType<AgentType>{

  name?: string;
  description?: string;
  entity?: string;
  active?: boolean;
  activationPeriod?: AgentTimeUnitsEnum;
  filter?: string;
  actions?: IAppAction[];
  constructor(model: Partial<AgentType>) {
    super(model);
  }
}


export enum AgentTimeUnitsEnum{
  Hourly,
  Daily,
  Monthly,
}

export const AgentTimeUnitsEnum2LabelMapping : Record<AgentTimeUnitsEnum, string> = {
  [AgentTimeUnitsEnum.Hourly]: 'ساعتی',
  [AgentTimeUnitsEnum.Daily]: 'روزانه',
  [AgentTimeUnitsEnum.Monthly]: 'ماهانه',
}

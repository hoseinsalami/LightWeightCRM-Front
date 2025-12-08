import {GenericType} from "../../_types/genericType.type";
import {TicketTypeEnum} from "../../_enums/ticket-type.enum";
import {TicketStateEnum} from "../../_enums/ticket-state.enum";
import {ReportMetricEnum} from "../../_enums/report-metric.enum";
import {ReportDimensionEnum} from "../../_enums/report-dimension.enum";

export class TicketReportInput extends GenericType<TicketReportInput>{
  filters?: TicketReportFilter;
  primaryDimension?: ReportDimensionEnum;
  secondaryDimension?: ReportDimensionEnum;
  Metric?: ReportMetricEnum;

  constructor(model?: Partial<TicketReportInput>) {
    super();

    if (model.filters){
      this.filters = new TicketReportFilter(model.filters)
    } else {
      this.filters = new TicketReportFilter({})
    }


  }
}

export class TicketReportFilter extends GenericType<TicketReportFilter>{
  employeeIds?: number[];
  customerIds?: number[];
  fromDate?: string;
  toDate?: string;
  ticketStates?: TicketStateEnum[];
  ticketTypes?: TicketTypeEnum[];

  constructor(model?: Partial<TicketReportFilter>) {
    super(model);

    if (model?.customerIds) {
      this.customerIds = [...model.customerIds];
    }

    if (model?.employeeIds) {
      this.employeeIds = [...model.employeeIds];
    }

  }
}

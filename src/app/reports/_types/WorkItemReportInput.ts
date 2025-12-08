import {GenericType} from "../../_types/genericType.type";
import {ReportWorkItemDimensionEnum} from "../../_enums/report-workItem-dimension.enum";
import {ReportWorkItemMetricEnum} from "../../_enums/report-workItem-metric.enum";
import {WorkItemStatesEnum} from "../../path/_enums/work-item-states.enum";

export class WorkItemReportInput extends GenericType<WorkItemReportInput>{
  filters?: WorkItemReportFilters;
  primaryGroup?: ReportWorkItemDimensionEnum;
  secondaryGroup?: ReportWorkItemDimensionEnum;
  metric?: ReportWorkItemMetricEnum;

  constructor(model?: Partial<WorkItemReportInput>) {
    super(model);

    if (model.filters){
      this.filters = new WorkItemReportFilters(model.filters);
    } else {
      this.filters = new WorkItemReportFilters({})
    }

  }

}

export class WorkItemReportFilters extends GenericType<WorkItemReportFilters>{
  stepIds?: number[];
  adminIds?: number[];
  currentUserIds?: number[];
  failureReasonIds?: number[];
  customerIds?: number[];
  statuses?: WorkItemStatesEnum[];
  createdFrom?: string;
  createdTo?: string;
  finishedFrom?: string;
  finishedTo?: string;

  constructor(model?: Partial<WorkItemReportFilters>) {
    super(model);

    if (model?.stepIds) {
      this.stepIds = [...model.stepIds];
    }

    if (model?.currentUserIds) {
      this.currentUserIds = [...model.currentUserIds];
    }

    if (model?.failureReasonIds) {
      this.failureReasonIds = [...model.failureReasonIds];
    }

    if (model?.customerIds) {
      this.customerIds = [...model.customerIds];
    }

  }
}


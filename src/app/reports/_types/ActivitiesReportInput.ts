import {GenericType} from "../../_types/genericType.type";
import {ReportActivityDimensionEnum} from "../../_enums/report-activity-dimension.enum";
import {ReportActivityMetricEnum} from "../../_enums/report-activity-metric.enum";

export class ActivitiesReportInput extends GenericType<ActivitiesReportInput>{
  filters?: ActivitiesReportFilter;
  primaryGroup?: ReportActivityDimensionEnum;
  secondaryGroup?: ReportActivityDimensionEnum;
  metirc?: ReportActivityMetricEnum;

  constructor(model?: Partial<ActivitiesReportInput>) {
    super(model);

    if (model.filters){
      this.filters = new ActivitiesReportFilter(model.filters);
    } else {
      this.filters = new ActivitiesReportFilter({})
    }

  }
}

export class ActivitiesReportFilter extends GenericType<ActivitiesReportFilter>{
  stepIds?: number[];
  userIds?: number[];
  assignUserIds?: number[];
  customerIds?: number[];
  activityTypeIds?: number[];

  createdFrom?:any;
  createdTo?:any;

  dueDateFrom?:any;
  dueDateTo?:any;

  doneDateFrom?:any;
  doneDateTo?:any;

  isDone?:boolean;
  isOverdue?:boolean;

  constructor(model?: Partial<ActivitiesReportFilter>) {
    super(model);

    if (model?.stepIds) {
      this.stepIds = [...model.stepIds];
    }

    if (model?.userIds) {
      this.userIds = [...model.userIds];
    }

    if (model?.assignUserIds) {
      this.assignUserIds = [...model.assignUserIds];
    }

    if (model?.customerIds) {
      this.customerIds = [...model.customerIds];
    }

    if (model?.activityTypeIds) {
      this.activityTypeIds = [...model.activityTypeIds];
    }

  }

}

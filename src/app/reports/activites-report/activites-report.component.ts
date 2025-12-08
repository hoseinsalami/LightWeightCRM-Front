import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivitiesReportInput} from "../_types/ActivitiesReportInput";
import {ReportsService} from "../reports.service";
import {LoadingService} from "../../_services/loading.service";
import {MessageService, TreeNode} from "primeng/api";
import {CommonModule} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
import {TreeSelectModule} from "primeng/treeselect";
import {DividerModule} from "primeng/divider";
import {ButtonModule} from "primeng/button";
import {ChartModule} from "primeng/chart";
import {IActiveDate, NgPersianDatepickerModule} from "ng-persian-datepicker";
import {FieldsetModule} from "primeng/fieldset";
import {AutoCompleteModule} from "primeng/autocomplete";
import {PanelModule} from "primeng/panel";
import {InputTextModule} from "primeng/inputtext";
import {UserTypeBase} from "../../setting/_types/user.type";
import {CustomerSpecification} from "../../path/_types/create-work-item.type";
import {TreeNodeSelectEvent, TreeNodeUnSelectEvent} from "primeng/tree";
import {ChartType} from "chart.js";
import {Utilities} from "../../_classes/utilities";
import {
  ReportWorkItemMetricEnum,
  ReportWorkItemMetricEnum2LabelMapping
} from "../../_enums/report-workItem-metric.enum";
import {
  ReportWorkItemDimensionEnum,
  ReportWorkItemDimensionEnum2LabelMapping
} from "../../_enums/report-workItem-dimension.enum";
import {
  ReportActivityDimensionEnum,
  ReportActivityDimensionEnum2LabelMapping
} from "../../_enums/report-activity-dimension.enum";
import {CheckboxModule} from "primeng/checkbox";
import {AccordionModule} from "primeng/accordion";
import {UIChart} from "primeng/chart/chart";

@Component({
  selector: 'app-activites-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    MultiSelectModule,
    TreeSelectModule,
    DividerModule,
    ButtonModule,
    ChartModule,
    NgPersianDatepickerModule,
    FieldsetModule,
    AutoCompleteModule,
    PanelModule,
    InputTextModule,
    CheckboxModule,
    AccordionModule
  ],
  templateUrl: './activites-report.component.html',
  styleUrl: './activites-report.component.scss'
})
export class ActivitesReportComponent implements OnInit, AfterViewInit{

  oneObject: ActivitiesReportInput = new ActivitiesReportInput({});
  activityType:any;
  expertUsers: UserTypeBase[];
  assignUser: UserTypeBase[];
  metric:any
  dimension:any;
  secondaryOptions= [];

  filteredCustomer: CustomerSpecification[];
  selectedCustomers: CustomerSpecification[] = [];

  selectedNodes: TreeNode[] = [];
  listOfPath:TreeNode[];

  isDoneType:any;
  isOverdueType:any;

  createdFrom!: string;
  createdTo!: string;
  createdFromControl = new FormControl(null)
  createdToControl = new FormControl(null)

  dueDateFrom: any;
  dueDateTo: any;
  dueDateFromControl = new FormControl(null);
  dueDateToControl = new FormControl(null);

  doneDateFrom:any;
  doneDateTo:any;
  doneDateFromControl = new FormControl(null);
  doneDateToControl = new FormControl(null);

  type:ChartType  = 'bar';
  showChart = true;
  chartData:any;
  chartRawData: any;
  options:any;
  @ViewChild('chart') chart: UIChart;

  constructor(
    private service: ReportsService,
    private loading: LoadingService,
    private messageService: MessageService
  ) {
    this.dimension = Utilities.ConvertEnumToKeyPairArray(ReportActivityDimensionEnum, ReportActivityDimensionEnum2LabelMapping);
    this.metric = Utilities.ConvertEnumToKeyPairArray(ReportWorkItemMetricEnum, ReportWorkItemMetricEnum2LabelMapping)
    this.secondaryOptions = [...this.dimension]
    this.isDoneType = [
      {
        title: 'انجام شده',
        value: true
      },
      {
        title: 'انجام نشده',
        value: false
      }
    ]
    this.isOverdueType = [
      {
        title: 'معوق شده',
        value: true
      },
      {
        title: 'معوق نشده',
        value: false
      }
    ]
  }

  ngOnInit() {
    this.getListOfPaths()
    this.getListOfExperts();
    this.getListOfActivityType();
    this.getListOfAdmins();
    this.options = this.buildChartOptions();
  }

  ngAfterViewInit() {
    this.createdFromControl.setValue(null);
    this.createdToControl.setValue(null);
    this.doneDateFromControl.setValue(null);
    this.doneDateToControl.setValue(null);
    this.dueDateFromControl.setValue(null);
    this.dueDateToControl.setValue(null);
  }

  onRegisterReportActivities(){
    if (this.oneObject.primaryGroup == null || this.oneObject.primaryGroup == undefined){
      return this.messageService.add({
        severity: 'error',
        summary: 'خطا',
        detail: 'مبنای اصلی اجباری می باشد',
      })
    }

    this.oneObject.filters.createdFrom = this.createdFrom ? this.createdFrom.trim()?.concat('T' + '00:00:00') : null;
    this.oneObject.filters.createdTo = this.createdTo ? this.createdTo.trim()?.concat('T' + '23:59:59') : null;
    this.oneObject.filters.doneDateFrom = this.doneDateFrom ? this.doneDateFrom.trim()?.concat('T' + '00:00:00') : null;
    this.oneObject.filters.doneDateTo = this.doneDateTo ? this.doneDateTo.trim()?.concat('T' + '23:59:59') : null;
    this.oneObject.filters.dueDateFrom = this.dueDateFrom ? this.dueDateFrom.trim()?.concat('T' + '00:00:00') : null;
    this.oneObject.filters.dueDateTo = this.dueDateTo ? this.dueDateTo.trim()?.concat('T' + '23:59:59') : null;
    this.oneObject.filters.customerIds = this.selectedCustomers.map(item => item.id);
    this.loading.show();
    this.service.onReportActivities(this.oneObject).subscribe(res => {
      this.loading.hide();
      this.chartRawData = res;
      this.type = 'bar'
      this.chartData = this.convertToChartJsData(res,this.type);
      this.options = this.buildChartOptions();
    }, error => {
      this.loading.hide();
    })
  }

  getListOfPaths(){
    this.loading.show();
    this.service.getListOfPaths().subscribe((res:TreeNode[]) => {
      this.loading.hide();
      this.listOfPath = this.convertToTreeNodes(res);
    }, error => {
      this.loading.hide();
    })
  }

  convertToTreeNodes(data:any[]): TreeNode[]{
    return data.map(item => ({
      label: item.title,
      data: item.id,
      key: `path-${item.id}`,
      children: item.steps.map(step => ({
        label: step.title || 'بدون عنوان',
        data: step.id,
        key: `step-${step.id}`,
      }))
    }));
  }

  getListOfExperts(){
    this.loading.show();
    this.service.getListOfExperts().subscribe(res => {
      this.loading.hide();
      this.expertUsers = res
    }, error => {
      this.loading.hide();
    })
  }

  getListOfActivityType(){
    this.loading.show();
    this.service.getActivityType().subscribe(res =>{
      this.loading.hide();
      this.activityType = res;
    }, error => {
      this.loading.hide()
    })
  }

  getListOfAdmins(){
    this.loading.show();
    this.service.getListOfAdmins().subscribe(res => {
      this.loading.hide();
      this.assignUser = res;
    }, error => {
      this.loading.hide();
    })
  }

  searchCustomerReport(event: any) {
    this.service.onSearchCustomer(event.query).subscribe(res => {
      this.filteredCustomer = res.map(customer =>({
        ...customer,
        fullName: `${customer.name} ${customer.family} (${customer.companyName})`
      })) as CustomerSpecification[];
    })
  }

  selectCustomer(filter: any){
    this.oneObject.filters.customerIds = this.selectedCustomers.map(c => c.id)
  }

  selectCategory(event: TreeNodeSelectEvent) {
    this.updateSelectedStepIds();
  }

  updateSelectedStepIds() {
    const stepIds: number[] = [];

    this.selectedNodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => stepIds.push(child.data));
      } else {
        stepIds.push(node.data);
      }
    });

    this.oneObject.filters.stepIds = Array.from(new Set(stepIds));

    console.log('Selected Step IDs:', this.oneObject.filters.stepIds);

  }

  onNodeUnselect(event: TreeNodeUnSelectEvent) {
    this.updateSelectedStepIds();
  }

  typeOfChart(type:ChartType) {
    this.type = type;
    this.showChart =false;
    if (this.chartRawData){
      this.chartData = this.convertToChartJsData(this.chartRawData, this.type);
    }
    setTimeout(() => {
      this.showChart = true;
    }, 50);
    this.options = this.buildChartOptions();
  }

  buildChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: this.oneObject.secondaryGroup !== null || this.type === 'pie' ? true : false,
        },
        datalabels: {
          display: true,
          anchor: 'center',
          align: 'center',
          textAlign: 'center',
        },
        zoom: {
          pan: { enabled: true, mode: 'x' },
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'x',
          },
        },
      },
      scales: {
        y: {
          display: this.type === 'pie' ? false : true,
          beginAtZero: true,
          ticks: {
            font: {
              size: 11,
              weight: 'bold',
            },
          },
          grid: { display: true },
          title: {
            display: true,
            text: '',
            color: '#424242',
            font: {
              size: 14,
              weight: 'bold',
            },
          },
        },
        x: {
          display: this.type === 'pie' ? false : true,
          ticks: {
            autoSkip: false,
            font: {
              size: 11,
              weight: 'bold',
            },
          },
          grid: { display: false },
        },
      },
    };
  }

  convertToChartJsData(data:any[], chartType: ChartType = 'bar'){
    const is3D = data.some(item => item.secondaryGroup !== null);

    if (!is3D) {
      const labelMap = new Map<string, number>();

      for (const item of data) {
        const group = item.primaryGroup || 'نامشخص';
        labelMap.set(group, (labelMap.get(group) || 0) + item.value);
      }

      const labels = Array.from(labelMap.keys());
      const values = Array.from(labelMap.values());

      const colors = [
        '#42A5F5', '#66BB6A', '#FFA726', '#AB47BC',
        '#26C6DA', '#FF7043', '#9CCC65', '#EC407A',
        '#7E57C2', '#26A69A'
      ];

      return {
        labels,
        datasets: [
          {
            label: 'مقدار کل',
            backgroundColor: chartType === 'pie'
              ? labels.map((_, i) => colors[i % colors.length])
              : '#42A5F5',
            borderColor: chartType === 'pie'
              ? labels.map((_, i) => colors[i % colors.length])
              : '#42A5F5',
            data: values
          }
        ]
      };
    } else {
      console.log('3D')
      // حالت سه بعدی: primaryGroup => محور X, secondaryGroup => دسته‌بندی (dataset)
      const primaryLabelsSet = new Set<string>();
      const datasetMap = new Map<string, Map<string, number>>();

      for (const item of data) {
        const xLabel = item.primaryGroup;
        const datasetLabel = item.secondaryGroup!;
        const value = item.value;

        primaryLabelsSet.add(xLabel);

        if (!datasetMap.has(datasetLabel)) {
          datasetMap.set(datasetLabel, new Map());
        }

        const xMap = datasetMap.get(datasetLabel)!;
        xMap.set(xLabel, (xMap.get(xLabel) || 0) + value);
      }

      const labels = Array.from(primaryLabelsSet);

      const datasets = Array.from(datasetMap.entries()).map(([label, valueMap], index) => {
        const colors = ['#42A5F5', '#EC407A', '#FFCA28', '#66BB6A', '#AB47BC'];
        return {
          label, // secondaryGroup به عنوان label
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          data: labels.map(l => valueMap.get(l) || 0)
        };
      });

      return {
        labels,
        datasets
      };
    }
  }

  onPrimaryChange(){
    this.updateSecondaryOptions()
  }

  updateSecondaryOptions() {
    this.secondaryOptions = this.dimension.filter(
      d => d.value !== this.oneObject.primaryGroup
    );

    // در صورتی که مقدار انتخاب شده در secondary همون primary باشه، پاکش کن
    if (this.oneObject.secondaryGroup === this.oneObject.primaryGroup) {
      this.oneObject.secondaryGroup = null;
    }
  }

  // **************** start Date Picker ****************
  initialCreatedFromDatePicker(event: any) {
    // this.createdFrom = event.gregorian ?? '';
  }
  selectCreatedFromDatePicker(event: any) {
    this.createdFrom = event.gregorian ?? '';
  }
  initialCreatedToDatePicker(event: IActiveDate) {
    // this.createdTo = event.gregorian ?? '';
  }
  selectCreatedToDatePicker(event: IActiveDate) {
    this.createdTo = event.gregorian ?? '';
  }

  selectDoneDateFromDatePicker(event: any){
    this.doneDateFrom = event.gregorian ?? '';
  }
  initialDoneDateFromDatePicker(event: any){
    // this.doneDateFrom = event.gregorian ?? '';
  }
  initialDoneDateToDatePicker(event:any){
    // this.doneDateTo = event.gregorian ?? '';
  }
  selectDoneDateToDatePicker(event:any){
    this.doneDateTo = event.gregorian ?? '';
  }

  initialDueFromDatePicker(event: any) {
    // this.dueDateFrom = event.gregorian ?? '';
  }
  selectDueFromDatePicker(event: any) {
    this.dueDateFrom = event.gregorian ?? '';
  }
  initialDueToDatePicker(event: IActiveDate) {
    // this.dueDateTo = event.gregorian ?? '';
  }
  selectDueToDatePicker(event: IActiveDate) {
    this.dueDateTo = event.gregorian ?? '';
  }



  isSelected(customer: any): boolean {
    return this.selectedCustomers?.some(c => c.id === customer.id);
  }

  toggleCustomer(customer: any): void {
    if (!this.selectedCustomers) this.selectedCustomers = [];

    const exists = this.selectedCustomers.some(c => c.id === customer.id);
    if (exists) {
      this.selectedCustomers = this.selectedCustomers.filter(c => c.id !== customer.id);
    } else {
      this.selectedCustomers = [...this.selectedCustomers, customer];
    }
  }


  menuOpen: boolean = true;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    setTimeout(() => {
      if (this.chart?.chart?.resize) {
        this.chart.reinit(); // روش قطعی و تضمینی
      }
    }, 300); // برابر با زمان transition CSS

  }



}

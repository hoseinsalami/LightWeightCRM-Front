import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {WorkItemReportInput} from "../_types/WorkItemReportInput";
import {IActiveDate, NgPersianDatepickerModule} from "ng-persian-datepicker";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CustomerSpecification} from "../../path/_types/create-work-item.type";
import {ReportsService} from "../reports.service";
import {LoadingService} from "../../_services/loading.service";
import {MessageService, TreeNode} from "primeng/api";
import {UserTypeBase} from "../../setting/_types/user.type";
import {CommonModule} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
import {TreeSelectModule} from "primeng/treeselect";
import {DividerModule} from "primeng/divider";
import {ButtonModule} from "primeng/button";
import {ChartModule} from "primeng/chart";
import {FieldsetModule} from "primeng/fieldset";
import {AutoCompleteModule} from "primeng/autocomplete";
import {PanelModule} from "primeng/panel";
import {InputTextModule} from "primeng/inputtext";
import {TreeNodeSelectEvent, TreeNodeUnSelectEvent} from "primeng/tree";
import {Utilities} from "../../_classes/utilities";
import {
  ReportWorkItemDimensionEnum,
  ReportWorkItemDimensionEnum2LabelMapping
} from "../../_enums/report-workItem-dimension.enum";
import {
  ReportWorkItemMetricEnum,
  ReportWorkItemMetricEnum2LabelMapping
} from "../../_enums/report-workItem-metric.enum";
import {WorkItemStatesEnum, WorkItemStatesEnum2LabelMapping} from "../../path/_enums/work-item-states.enum";
import {ChartOptions, ChartType} from "chart.js";
import {CheckboxModule} from "primeng/checkbox";
import {UIChart} from "primeng/chart/chart";
import {AccordionModule} from "primeng/accordion";

@Component({
  selector: 'app-caries-report',
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
  templateUrl: './caries-report.component.html',
  styleUrl: './caries-report.component.scss',
})
export class CariesReportComponent implements OnInit, AfterViewInit{

  oneObject: WorkItemReportInput = new WorkItemReportInput({});
  expertUsers: UserTypeBase[];
  adminUsers: UserTypeBase[];
  listOfPath:TreeNode[];
  listOfFailureReasons:any;
  filteredCustomer: CustomerSpecification[];
  selectedCustomers: CustomerSpecification[] = [];

  createdFrom!: string;
  createdTo!: string;
  finishedFrom!: string;
  finishedTo!: string;
  createdFromControl = new FormControl(null)
  createdToControl = new FormControl(null)
  finishedFromControl = new FormControl(null)
  finishedToControl = new FormControl(null)


  dimension:any;
  metric:any;
  status:any;
  secondaryOptions= [];

  selectedNodes: TreeNode[] = [];

  type:ChartType  = 'bar';
  showChart = true;
  chartData:any;
  chartRawData: any;
  options:any;
  @ViewChild('chart') chart: UIChart;

  constructor(
    private service:ReportsService,
    private loading: LoadingService,
    private messageService: MessageService,
  ) {
    this.dimension = Utilities.ConvertEnumToKeyPairArray(ReportWorkItemDimensionEnum, ReportWorkItemDimensionEnum2LabelMapping);
    this.metric = Utilities.ConvertEnumToKeyPairArray(ReportWorkItemMetricEnum, ReportWorkItemMetricEnum2LabelMapping)
    this.status = Utilities.ConvertEnumToKeyPairArray(WorkItemStatesEnum, WorkItemStatesEnum2LabelMapping)
    this.secondaryOptions = [...this.dimension]

  }

  ngOnInit() {
    this.getListOfPaths()
    this.getListOfAdmins()
    this.getListOfExperts()
    this.getListOfFailureReasons()
    this.options = this.buildChartOptions();

  }

  ngAfterViewInit() {
    this.createdFromControl.setValue(null);
    this.createdToControl.setValue(null);
    this.finishedFromControl.setValue(null);
    this.finishedToControl.setValue(null);
  }

  onRegisterReportCaries(){
    if (this.oneObject.primaryGroup == null || this.oneObject.primaryGroup == undefined){
      return this.messageService.add({
        severity: 'error',
        summary: 'خطا',
        detail: 'مبنای اصلی اجباری می باشد',
      })
    }
    this.oneObject.filters.createdFrom = this.createdFrom ? this.createdFrom.trim()?.concat('T' + '00:00:00') : null;
    this.oneObject.filters.createdTo = this.createdTo ? this.createdTo.trim()?.concat('T' + '23:59:59') : null;
    this.oneObject.filters.finishedFrom = this.finishedFrom ? this.finishedFrom.trim()?.concat('T' + '00:00:00') : null;
    this.oneObject.filters.finishedTo = this.finishedTo ? this.finishedTo.trim()?.concat('T' + '23:59:59') : null;
    this.oneObject.filters.customerIds = this.selectedCustomers.map(item => item.id)
    this.loading.show();
    this.service.onReportWorkItems(this.oneObject).subscribe(res =>{
      this.loading.hide();
      this.chartRawData = res;
      this.type = 'bar'
      this.options = this.buildChartOptions();

      this.chartData = this.convertToChartJsData(res,this.type);
    }, error => {
      this.loading.hide();
    })

  }


  getListOfAdmins(){
    this.loading.show();
    this.service.getListOfAdmins().subscribe(res => {
      this.loading.hide();
      this.adminUsers = res;
    }, error => {
      this.loading.hide();
    })
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

  getListOfFailureReasons(){
    this.loading.show();
    this.service.getListOfFailureReasons().subscribe(res =>{
      this.loading.hide();
      this.listOfFailureReasons = res;
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

  selectFinishedFromDatePicker(event: any){
    this.finishedFrom = event.gregorian ?? '';
  }

  initialFinishedFromDatePicker(event: any){
    // this.finishedFrom = event.gregorian ?? '';
  }

  initialFinishedToDatePicker(event:any){
    // this.finishedTo = event.gregorian ?? '';
  }

  selectFinishedToDatePicker(event:any){
    this.finishedTo = event.gregorian ?? '';
  }
  // **************** end Date Picker ****************

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
      } else {
        window.dispatchEvent(new Event('resize')); // fallback
      }
    }, 300); // برابر با زمان transition CSS

  }

}

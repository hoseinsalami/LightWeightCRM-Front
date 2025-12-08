import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FieldsetModule} from "primeng/fieldset";
import {CommonModule} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IActiveDate, NgPersianDatepickerModule} from "ng-persian-datepicker";
import {MultiSelectModule} from "primeng/multiselect";
import {ReportsService} from "../reports.service";
import {LoadingService} from "../../_services/loading.service";
import {TicketReportInput} from "../_types/TicketReportInput";
import {CustomerSpecification} from "../../path/_types/create-work-item.type";
import {AutoCompleteModule} from "primeng/autocomplete";
import {UserTypeBase} from "../../setting/_types/user.type";
import {Utilities} from "../../_classes/utilities";
import {TicketTypeEnum, TicketTypeEnum2LabelMapping} from "../../_enums/ticket-type.enum";
import {TicketStateEnum, TicketStateEnum2LabelMapping} from "../../_enums/ticket-state.enum";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {ReportDimensionEnum, ReportDimensionEnum2LabelMapping} from "../../_enums/report-dimension.enum";
import {DropdownModule} from "primeng/dropdown";
import {ReportMetricEnum, ReportMetricEnum2LabelMapping} from "../../_enums/report-metric.enum";
import {ChartModule} from "primeng/chart";
import {PanelModule} from "primeng/panel";
import {Chart, ChartType} from "chart.js";
import {UIChart} from "primeng/chart/chart";
import {MessageService} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";
import {CheckboxModule} from "primeng/checkbox";
import {AccordionModule} from "primeng/accordion";

@Component({
  selector: 'app-ticket-report',
  standalone: true,
  imports: [
    CommonModule,
    FieldsetModule,
    FormsModule,
    MultiSelectModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    NgPersianDatepickerModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    DropdownModule,
    ChartModule,
    PanelModule,
    TooltipModule,
    CheckboxModule,
    AccordionModule
  ],
  templateUrl: './ticket-report.component.html',
  styleUrl: './ticket-report.component.scss'
})
export class TicketReportComponent implements OnInit, AfterViewInit{


  startDate!: string;
  finishDate!: string;
  startDateTimeControl = new FormControl(null);
  finishDateTimeControl = new FormControl(null);

  oneObject: TicketReportInput = new TicketReportInput({});
  expertUsers: UserTypeBase[];
  filteredCustomer: CustomerSpecification[];
  selectedCustomers: CustomerSpecification[] = [];

  ticketType: any;
  ticketState: any;
  dimension:any
  metric:any
  chartData:any;
  chartRawData: any;


  secondaryOptions= []
  options:any;

  panelCollapsed: boolean = false;

  type:ChartType  = 'bar';
  showChart = true;
  @ViewChild('chart') chart: UIChart;

  constructor(
    private service: ReportsService,
    private loading: LoadingService,
    private messageService: MessageService
    ) {
    this.ticketType = Utilities.ConvertEnumToKeyPairArray(TicketTypeEnum,TicketTypeEnum2LabelMapping);
    this.ticketState = Utilities.ConvertEnumToKeyPairArray(TicketStateEnum,TicketStateEnum2LabelMapping);
    this.dimension = Utilities.ConvertEnumToKeyPairArray(ReportDimensionEnum,ReportDimensionEnum2LabelMapping);
    this.metric = Utilities.ConvertEnumToKeyPairArray(ReportMetricEnum,ReportMetricEnum2LabelMapping);
    this.secondaryOptions = [...this.dimension]

  }


  ngOnInit() {
    this.getUser();
    this.updateSecondaryOptions();
    this.options = this.buildChartOptions();
  }

  ngAfterViewInit() {
    this.startDateTimeControl.setValue(null);
    this.finishDateTimeControl.setValue(null);
  }

  getUser(){
    this.loading.show()
    this.service.getReportUser().subscribe(res =>{
      this.loading.hide()
      this.expertUsers = res
    }, error => {
      this.loading.hide()
    })
  }

  onRegisterReportTickets(){
    if (this.oneObject.primaryDimension == null || this.oneObject.primaryDimension == undefined){
      return this.messageService.add({
        severity: 'error',
        summary: 'خطا',
        detail: 'مبنای اصلی اجباری می باشد',
      })
    }
    this.oneObject.filters.fromDate = this.startDate ? this.startDate.trim()?.concat('T' + '00:00:00') : null;
    this.oneObject.filters.toDate = this.finishDate ? this.finishDate.trim()?.concat('T' + '23:59:59') : null;
    this.oneObject.filters.customerIds = this.selectedCustomers.map(item => item.id)
    this.loading.show();
    this.service.onReportTickets(this.oneObject).subscribe(res => {
      this.loading.hide();
      this.chartRawData = res;
      this.type = 'bar';
      this.chartData = this.convertToChartJsData(res,this.type);
      this.options = this.buildChartOptions();
    }, error => {
      this.loading.hide()
    })
  }

  searchCustomerReport(event: any) {
    this.service.onSearchCustomer(event.query).subscribe(res => {
      console.log(res)
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
      d => d.value !== this.oneObject.primaryDimension
    );

    // در صورتی که مقدار انتخاب شده در secondary همون primary باشه، پاکش کن
    if (this.oneObject.secondaryDimension === this.oneObject.primaryDimension) {
      this.oneObject.secondaryDimension = null;
    }
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
          display: this.oneObject.secondaryDimension !== null || this.type === 'pie' ? true : false,
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
  initialStartDatePicker(event: any) {
    // this.startDate = event.gregorian;
  }

  selectStartDate(event: any) {
    this.startDate = event.gregorian
  }

  initialFinishDatePicker(event: IActiveDate) {
    // this.finishDate = event.gregorian
  }

  selectFinishDate(event: IActiveDate) {
    this.finishDate = event.gregorian
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
      } else {
        window.dispatchEvent(new Event('resize')); // fallback
      }
    }, 300); // برابر با زمان transition CSS

  }

}

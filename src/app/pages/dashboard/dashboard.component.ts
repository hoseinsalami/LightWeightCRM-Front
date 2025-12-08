import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {MenuItem, Message, SharedModule} from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from '../../layout/service/app.layout.service';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import {NgStyle, CurrencyPipe, NgIf, DecimalPipe, NgFor, AsyncPipe, CommonModule} from '@angular/common';
import {CardModule} from "primeng/card";
import {DashboardService} from "../../_services/dashboard.service";
import {
  AirQualityMeasurement,
  DashboardOutputType,
  StationsInfo,
  WeatherMeasurement
} from "../../_types/dashboard.output.type";
import {environment} from "../../../environments/environment";
import {DividerModule} from "primeng/divider";
import {EChartsOption} from "echarts";
import * as echarts from 'echarts/core';
import {GaugeChart} from "echarts/charts";
import {NgxEchartsDirective, provideEchartsCore} from "ngx-echarts";
import {CanvasRenderer} from "echarts/renderers";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import * as L from "leaflet";
import {latLng, MapOptions, tileLayer} from "leaflet";
import {LeafletModule} from "@asymmetrik/ngx-leaflet";
import {LoadingService} from "../../_services/loading.service";
import {AuthenticationService} from "../../_services/authentication.service";
import {LoginOutputType} from "../../_types/login-output.type";
import {DashboardOutputSmokycarsType} from "../../_types/dashboard-output-smokycars.type";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {TabViewModule} from "primeng/tabview";
import {DialogModule} from "primeng/dialog";
import {Messages, MessagesModule} from "primeng/messages";
import {MessageModule} from "primeng/message";
import {CustomMessageService} from "../../_services/custom-message.service";
import {AuthImagePipe} from "../../_pipes/auth-image.pipe";
echarts.use([GaugeChart,CanvasRenderer])

@Component({
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    standalone: true,
    imports: [
        NgStyle,
        TableModule,
        SharedModule,
        ButtonModule,
        MenuModule,
        ChartModule,
        CurrencyPipe,
        CardModule,
        NgIf,
        NgFor,
        DecimalPipe,
        DividerModule,
        NgxEchartsDirective,
        JalaliDatePipe,
        LeafletModule,
        TabViewModule,
        DialogModule,
      MessagesModule,
      MessageModule,
      CommonModule,
      AuthImagePipe
    ],
    providers: [
      provideEchartsCore({ echarts }),
      JalaliDatePipe
    ]
})
export class DashboardComponent implements OnInit, OnDestroy {

    // baseUrl = environment.apiUrl + 'Dashboard/';
    baseUrl = environment.apiUrl;
    subscription!: Subscription;
    // dashboardRes?:DashboardOutputType;
    dashboardRes?:any;
    dashboardSmokyCars!: DashboardOutputSmokycarsType;
    optionInstantAQI!: EChartsOption;
    optionPast24HourAQI!: EChartsOption;
    airQuality:any;

    map: L.Map;
    currentMarker: L.Marker;
    options: MapOptions
    mapReady:boolean= false;
    Math: Math;
    userTypeLogin?:any;
    loginUser: LoginOutputType;

    // chart
    dataYear:any;
    optionYear:any;

    dataMonth:any;
    optionMonth:any;

    data15FixDetect:any;
    dataCarFrequencies: any
    userNotifications: {severity:string ,id:number,createTime:any,message:string}[] = [];
    showModal: boolean;

    airQualityImage:any;

    constructor(public layoutService: LayoutService,
                private dashboadrService:DashboardService,
                private messageService:CustomMessageService,
                private loading: LoadingService,
                private authenticationService: AuthenticationService,
                private jalaliDate : JalaliDatePipe) {


    }

    ngOnInit() {
      this.getDashboardPayesh()
    }

    ngOnDestroy() {

    }

  getDashboardPayesh(){
      this.loading.show()
      this.dashboadrService.getDashboard().subscribe((out)=>{
        this.loading.hide()
        this.dashboardRes = out;
        this.mapReady = true;
      }, error => {
        this.loading.hide();
      });
    }


}

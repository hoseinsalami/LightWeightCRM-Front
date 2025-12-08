import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {FatapHttpClientService} from "./fatap-http-client.service";
import {DashboardOutputType, DashboardTypeBase} from "../_types/dashboard.output.type";
import {DashboardOutputSmokycarsType} from "../_types/dashboard-output-smokycars.type";
import {BehaviorSubject, shareReplay, tap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    baseUrl = environment.apiUrl + 'Dashboard';

    private dashboardSubject = new BehaviorSubject<DashboardTypeBase | null>(null);
    dashboard$ = this.dashboardSubject.asObservable();
    constructor(private httpClient:FatapHttpClientService) {
    }

    getDashboard(){
        return this.httpClient.get<DashboardTypeBase>(this.baseUrl + '/Paths').pipe(
          tap(data => this.dashboardSubject.next(data)),
          shareReplay(1)
        );;
    }

  loadDashboard() {
    this.getDashboard().subscribe(data => {
      this.dashboardSubject.next(data);
    });
  }

  getDashboardSmokyCar(){
    return this.httpClient.get<DashboardOutputSmokycarsType>(this.baseUrl + 'Dashboard/SmokyCars');
  }

  getImage(){
      return this.httpClient.get(this.baseUrl + 'epmc/AirQualityStatisticsOfYear')
  }

  deleteDashboardNotifications(id){
    return this.httpClient.put(this.baseUrl + 'Dashboard/NotificationSeen/' + id,{});
  }

}

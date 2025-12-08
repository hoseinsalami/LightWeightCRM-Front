import { Injectable } from '@angular/core';
import {BaseCrudService} from "../_services/base-crud.service";
import {environment} from "../../environments/environment";
import {FatapHttpClientService} from "../_services/fatap-http-client.service";
import {TicketReportInput} from "./_types/TicketReportInput";
import {Observable} from "rxjs";
import {CustomerSpecification} from "../path/_types/create-work-item.type";
import {WorkItemReportInput} from "./_types/WorkItemReportInput";
import {ActivitiesReportInput} from "./_types/ActivitiesReportInput";

@Injectable({
  providedIn: 'root'
})
export class ReportsService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Management/Reports'

  constructor(private http: FatapHttpClientService) {
    super(http , '');
  }


  onSearchCustomer(keyword:string):Observable<CustomerSpecification[]>{
    return this.http.get<CustomerSpecification[]>(this.baseUrl + `/SearchCustomer/${keyword}`);
  }

  getReportUser():Observable<any>{
    return this.http.get(this.baseUrl + '/users');
  }

  getListOfAdmins():Observable<any>{
    return this.http.get(this.baseUrl + '/admins');
  }

  getListOfExperts():Observable<any>{
    return this.http.get(this.baseUrl + '/experts');
  }

  getListOfPaths(){
    return this.http.get(this.baseUrl + '/paths')
  }

  getListOfFailureReasons(){
    return this.http.get(this.baseUrl + '/failureReasons')
  }

  onReportTickets(input:TicketReportInput):Observable<any>{
    return this.http.post(this.baseUrl + '/Tickets', input);
  }

  onReportWorkItems(input:WorkItemReportInput):Observable<any>{
    return this.http.post(this.baseUrl + '/WorkItems', input);
  }

  onReportActivities(input:ActivitiesReportInput):Observable<any>{
    return this.http.post(this.baseUrl + '/Activities', input)
  }

  getActivityType(){
    return this.http.get(this.baseUrl + '/activityTypes')
  }

}

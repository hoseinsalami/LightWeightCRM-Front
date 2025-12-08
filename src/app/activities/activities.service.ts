import { Injectable } from '@angular/core';
import {BaseCrudService} from "../_services/base-crud.service";
import {FatapHttpClientService} from "../_services/fatap-http-client.service";
import {environment} from "../../environments/environment";
import {map, Observable} from "rxjs";
import {ActivitiesType} from "./type/activities.type";
import {DoneActivityType} from "./type/done-activity.type";
import {HttpResponse} from "@angular/common/http";
import {IStructureData} from "../work-item/_types/activity-workItem.type";

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'CRM/Activity'

  constructor(private http: FatapHttpClientService) {
    super(http , '')
  }



  getActivities(input:any):Observable<IStructureData<ActivitiesType>>{
    return this.http.post<IStructureData<ActivitiesType>>(this.baseUrl + '/user' , input);
  }

  onDoneActivity(input:any){
    return this.http.put<DoneActivityType>(this.baseUrl + '/Done' , input);
  }


}

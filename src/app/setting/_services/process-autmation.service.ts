import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {
  CreateProcessType,
  IEvent,
  IEventProcess,
  IProcessActionType,
  ProcessTypeBase
} from "../_types/CreateProcess.type";
import {FieldFilterDescriptor} from "../_types/filter.type";
import {IStructureData} from "../../work-item/_types/activity-workItem.type";
import {ActivitiesType} from "../../activities/type/activities.type";


@Injectable({
  providedIn: 'root'
})
export class ProcessAutmationService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Management/AutomatedProcess'
  constructor(private http: FatapHttpClientService) {
    super(http , '')
  }

  getAutomatedProcess(input:any):Observable<IStructureData<ProcessTypeBase>>{
    return this.http.post<any>(this.baseUrl + '/list', input)
  }

  getDataJson(entity:string):Observable<any>{
    return this.http.get(this.baseUrl + '/filters/' + entity)
  }

  onRegisterAutomatedProcess(input:CreateProcessType):Observable<CreateProcessType>{
    return this.http.post(this.baseUrl , input)
  }

  getAutomatePath():Observable<any>{
    return this.http.get(this.baseUrl + '/Paths')
  }

  getActionData():Observable<IProcessActionType[]>{
    return this.http.get<IProcessActionType[]>(this.baseUrl + '/actions')
  }

  getFilterInputData(action:string,entityEvent:string):Observable<FieldFilterDescriptor[]>{
    return this.http.get<FieldFilterDescriptor[]>(this.baseUrl + '/actionInputModel?action=' + action + '&senderType=' + entityEvent)
  }

  getEntityModel(entity:string):Observable<FieldFilterDescriptor[]>{
    return this.http.get<FieldFilterDescriptor[]>(this.baseUrl + `/EntityModel/${entity}`)
  }

  getEvents():Observable<IEvent[]>{
    return this.http.get<IEvent[]>(this.baseUrl + '/events');
  }

  putSwitchAction(id:number){
    return this.http.put(this.baseUrl + `/SwitchActivation/${id}` , {})
  }

}

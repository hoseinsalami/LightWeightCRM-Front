import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {environment} from "../../../environments/environment";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {Observable} from "rxjs";
import {FieldFilterDescriptor} from "../_types/filter.type";
import {CreateProcessType, IProcessActionType} from "../_types/CreateProcess.type";

@Injectable({
  providedIn: 'root'
})
export class AgentService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'CRM/Agent';
  constructor(private http: FatapHttpClientService) {
    super(http, '');
  }


  getEntities():Observable<{ entity: string, title: string }[]>{
    return this.http.get(this.baseUrl + '/Entities')
  }

  postChangeState(id:number){
    return this.http.post(this.baseUrl + `/ChangeActiveState/${id}`, {})
  }

  getFilters(entity:string):Observable<any>{
    return this.http.get(this.baseUrl + `/Filters/${entity}`)
  }

  getEntityModel(entity:string):Observable<FieldFilterDescriptor[]>{
    return this.http.get<FieldFilterDescriptor[]>(this.baseUrl + `/EntityModel/${entity}`)
  }

  getFilterInputData(action:string,entityEvent:string):Observable<FieldFilterDescriptor[]>{
    return this.http.get<FieldFilterDescriptor[]>(this.baseUrl + '/actionInputModel?action=' + action + '&senderType=' + entityEvent)
  }

  getActionData():Observable<IProcessActionType[]>{
    return this.http.get<IProcessActionType[]>(this.baseUrl + '/actions')
  }

  onRegisterAutomatedProcess(input:CreateProcessType):Observable<CreateProcessType>{
    return this.http.post(this.baseUrl , input)
  }

}

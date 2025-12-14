import { Injectable } from '@angular/core';
import {CustomerSpecification} from "../../path/_types/create-work-item.type";
import {Observable} from "rxjs";
import {BaseCrudService} from "../../_services/base-crud.service";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {environment} from "../../../environments/environment";
import {ActivityWorkItemType, IStructureData} from "../../work-item/_types/activity-workItem.type";
import {AccustomType} from "../_types/accustom.type";
import {TagTypeBase} from "../_types/tag.type";
import {SendMessageType} from "../../path/_types/send-message.type";

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'CRM/customer'
  constructor(private http: FatapHttpClientService) {
    super(http , '')
  }


  onCreateCustomer(input:CustomerSpecification):Observable<CustomerSpecification>{
    return this.http.post<CustomerSpecification>(this.baseUrl + 'CRM/customer',input);
  }

  // getListOfNoteCustomer(id:string,from:number,row:number):Observable<NoteWorkItem[]>{
  //   return this.http.get(environment.apiUrl + `CRM/Note/customer/${id}?from=${from}&rows=${row}`)
  // }

  // getListOfActivitiesCustomer(id:string,from:number,row:number):Observable<ActivityWorkItemType[]>{
  //   return this.http.get(environment.apiUrl + `CRM/Activity/customer/${id}?from=${from}&rows=${row}`)
  // }

  getAccustom():Observable<AccustomType[]>{
    return this.http.get(this.baseUrl + '/AccustomMethods')
  }

  onUpdateCustomer(customerId:number , customerInfo: CustomerSpecification){
    return this.http.put(this.baseUrl + `/${customerId}` , customerInfo)
  }

  getCustomerDetail(customerId:number):Observable<CustomerSpecification>{
    return this.http.get(this.baseUrl + `/${customerId}`)
  }

  getTagsWorkItem():Observable<IStructureData<TagTypeBase>>{
    return this.http.get<IStructureData<TagTypeBase>>(this.baseUrl + `/Tags`)
  }

  onAssignTag(input:{tagId:number, customerId: number}){
    return this.http.put(this.baseUrl + '/AssignTag', input)
  }

  deleteTag(input:{tagId:number, customerId: number}){
    return this.http.put(this.baseUrl + '/DeatchTag', input)
  }

  sendMessage(input:SendMessageType){
    return this.http.post(this.baseUrl + '/SendMessage', input);
  }

}

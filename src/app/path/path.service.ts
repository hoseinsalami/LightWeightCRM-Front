import { Injectable } from '@angular/core';
import {BaseCrudService} from "../_services/base-crud.service";
import {FatapHttpClientService} from "../_services/fatap-http-client.service";
import {environment} from "../../environments/environment";
import {BehaviorSubject, map, Observable, Subject} from "rxjs";
import {PathWorkItemsDetailType, StepType} from "./_types/path-work-items-detail.type";
import {CreateWorkItemType, CustomerSpecification, WorkItemType} from "./_types/create-work-item.type";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";
import {UserTypeBase} from "../setting/_types/user.type";
import {SearchType} from "./_types/search.type";
import {SendMessageType} from "./_types/send-message.type";
import {CreatePathType, CreateStepType} from "../setting/_types/createPath.type";

@Injectable({
  providedIn: 'root'
})
export class PathService extends BaseCrudService{

  override baseUrl = environment.apiUrl;

  private pathIdSubject = new BehaviorSubject<string | null>(null);
  searchSubject = new Subject<string>();
  constructor(private http: FatapHttpClientService, private router: Router,  private activatedRoute:ActivatedRoute) {
    super(http , '')
  }

  setPathId(id:string){
    this.pathIdSubject.next(id)
  }

  getPathId(): Observable<string>{
    return this.pathIdSubject.asObservable();
  }

  getListOfStep(id:string):Observable<StepType[]>{
    return this.http.get<StepType[]>(this.baseUrl + 'dashboard/Steps/'+id)
  }

  getListOfWorkItem(stepId:number, from:number, rows:number):Observable<WorkItemType[]>{
    return this.http.get<WorkItemType[]>(this.baseUrl + `Dashboard/WorkItems/${stepId}?from=${from}&rows=${rows}`)
  }

  getWorkItemsTask(id:string):Observable<PathWorkItemsDetailType[]>{
    return this.http.get<PathWorkItemsDetailType[]>(this.baseUrl + 'dashboard/workItems/' + id);
  }

  onCreateWorkItemTask(input:CreateWorkItemType):Observable<CreateWorkItemType>{
    return this.http.post<CreateWorkItemType>(this.baseUrl + 'CRM/WorkItem',input);
  }

  onSearchCustomer(input:string):Observable<CustomerSpecification[]>{
    return this.http.get<CustomerSpecification[]>(this.baseUrl + 'CRM/WorkItem/SearchCustomer/'+ input)
  }

  onSearchWorkItem(pathId:string,keyword:string){
    return this.http.get(this.baseUrl + `CRM/WorkItem/Search/${pathId}/${keyword}`)
  }

  listOfExpertUsers(pathId:string):Observable<UserTypeBase[]> {
    return this.http.get(this.baseUrl + 'CRM/WorkItem/PathExperts/'+ pathId)
  }

  addStep(input:{pathId:number, title:string, order:number, deadlineValue:number}):Observable<any>{
    return this.http.post(this.baseUrl +'Management/Path/steps/add', input)
  }

  getInfoStep(id:number):Observable<CreateStepType>{
    return this.http.get(this.baseUrl + `Management/Path/steps/${id}`)
  }

  editStep(input:CreateStepType){
    return this.http.put(this.baseUrl + 'Management/Path/steps/edit', input)
  }

  changeOrderStep(input:{stepId: number, pathId:number, newOrder:number}){
    return this.http.put(this.baseUrl + 'Management/Path/steps/changeOrder', input)
  }

  onUpdateCaries(id:number, input:CreatePathType){
    return this.http.put(this.baseUrl + `Management/Path/UpdateSpecification/${id}`, input)
  }

  onSearchAll(keyword:string):Observable<SearchType>{
    return this.http.get(this.baseUrl + `Dashboard/Search/${keyword}`)
  }

  onChangeDefaultPhone(customerId:number, input:{customerId:number, customerPhoneId:number}){
    return this.http.put(this.baseUrl + `CRM/Customer/ChangeDefaultPhone/${customerId}`, input)
  }

  sendMessage(input:SendMessageType){
    return this.http.post(this.baseUrl + 'CRM/WorkItem/SendMessage', input);
  }


}

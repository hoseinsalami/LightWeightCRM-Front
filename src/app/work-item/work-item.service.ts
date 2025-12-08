import { Injectable } from '@angular/core';
import {BaseCrudService} from "../_services/base-crud.service";
import {environment} from "../../environments/environment";
import {FatapHttpClientService} from "../_services/fatap-http-client.service";
import {EMPTY, Observable} from "rxjs";
import {ActivityType} from "../setting/_types/activity.type";
import {UserTypeBase} from "../setting/_types/user.type";
import {CustomerSpecification, WorkItemType} from "../path/_types/create-work-item.type";
import {CreateActivityType} from "../_types/create-activity.type";
import {PathWorkItemsDetailType} from "../path/_types/path-work-items-detail.type";
import {FailureReasonsType, WorkItemStatusType} from "./_types/work-item-status.type";
import {ChangeLogType} from "../_types/change-log.type";
import {IStructureData} from "./_types/activity-workItem.type";
import {TagTypeBase} from "../setting/_types/tag.type";

@Injectable({
  providedIn: 'root'
})
export class WorkItemService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'CRM/'
  constructor(private http : FatapHttpClientService) {
    super(http , '')
  }

  getDetailWorkItem(id:any):Observable<WorkItemType>{
    return this.http.get(environment.apiUrl + 'CRM/WorkItem/' + id)
  }

  getActivityTypes():Observable<ActivityType[]>{
    return this.http.get<ActivityType[]>(this.baseUrl + 'Activity/activityTypes');
  }

  getListOfUsers(pathId?:number):Observable<UserTypeBase[]>{
    return this.http.get<UserTypeBase[]>(this.baseUrl + 'Activity/users' + (pathId && pathId !== null ? `?pathId=${pathId}` : ``));
  }

  getSearchCustomer(keyword:string):Observable<CustomerSpecification[]>{
    return this.http.get<CustomerSpecification[]>(this.baseUrl + `Activity/SearchCustomer/${keyword}`);
  }

  getSearchWorkItems(keyword:string, customerId:number):Observable<WorkItemType[]>{
    if (customerId){
      return this.http.get<WorkItemType[]>(this.baseUrl + `Activity/SearchWorkItems/${keyword}?customerId=${customerId}`);
    } else {
      return this.http.get<WorkItemType[]>(this.baseUrl + `Activity/SearchWorkItems/${keyword}`);
    }
  }

  onCreateUpdateNewActivity(input:CreateActivityType , mode:string):any{
    switch (mode) {
      case 'new':
        return this.http.post<CreateActivityType>(this.baseUrl + 'Activity', input);
      case 'edit':
        return this.http.put<CreateActivityType>(this.baseUrl + 'Activity', input);
      default:
        console.warn('Please determine your service status.');
        return null; // یا می‌توان مقدار مناسب دیگری بازگرداند
    }
    // if (mode === 'new') {
    //   return this.http.post<CreateActivityType>(this.baseUrl + 'Activity' , input)
    // } else if (mode === 'edit'){
    //   return this.http.put<CreateActivityType>(this.baseUrl + 'Activity',input)
    // } else {
    //   console.warn('Please determine your service status.')
    //   return EMPTY;
    // }
  }

  onCreateUpdateNewDescription(input:any, mode:string):Observable<any>{
    if (mode === 'new'){
      return this.http.post(environment.apiUrl + 'CRM/Note/' , input)
    } else if (mode === 'edit'){
      return this.http.put(environment.apiUrl + 'CRM/Note/' , input)
    } else {
      console.warn('Please determine your service status.');
      return null
    }
  }

  // getListOfNoteWorkItem(id:string,from:number,row:number):Observable<NoteWorkItem[]>{
  //   return this.http.get(this.baseUrl + `Note/workItem/${id}?from=${from}&rows=${row}`)
  // }

  // getListOfActivitiesWorkItem(id:string,from:number,row:number):Observable<ActivityWorkItemType[]>{
  //   return this.http.get(this.baseUrl + `Activity/workItem/${id}?from=${from}&rows=${row}`)
  // }

  getPathSteps(pathId:string):Observable<PathWorkItemsDetailType[]>{
    return this.http.get(this.baseUrl + 'WorkItem/PathSteps/' + pathId)
  }

  onChangeStatusSteps(input:{workItemId:number, stepId:number}){
    return this.http.put(this.baseUrl + 'WorkItem/ChangeStep', input)
  }

  onChangeStatusWorkItem(input:WorkItemStatusType){
    return this.http.put(this.baseUrl + 'WorkItem/ChangeStatus', input)
  }

  onFailureReasons():Observable<FailureReasonsType[]>{
    return this.http.get(this.baseUrl + 'WorkItem/FailureReasons')
  }

  onAddNewComment(input:{content:string, activityId:number}){
    return this.http.post(this.baseUrl + 'Activity/Comment/Add', input)
  }

  onChangeExpert(input:{workItemId:number, userId:number}){
    return this.http.put(this.baseUrl + 'WorkItem/ChangeExpert', input)
  }

  changeLog(id:any):Observable<ChangeLogType[]>{
    return this.http.get(environment.apiUrl + 'CRM/WorkItem/ChangeLog/' + id);
  }

  deleteWorkItem(id?:number, isRemoveActivities?:boolean){
    return this.http.delete(this.baseUrl + `WorkItem/${id}?removeActivities=${isRemoveActivities}`)
  }

  getTagsWorkItem():Observable<IStructureData<TagTypeBase>>{
    return this.http.get<IStructureData<TagTypeBase>>(this.baseUrl + `WorkItem/Tags`)
  }

  onAssignTag(input:{tagId:number, workItemId: number}){
    return this.http.put(this.baseUrl + 'WorkItem/AssignTag', input)
  }

  deleteTag(input:{tagId:number, workItemId: number}){
    return this.http.put(this.baseUrl + 'WorkItem/DeatchTag', input)
  }

  postNewCustomerPhone(input:{customerId:number, title:string, phoneNumber:string}){
    return this.http.post(this.baseUrl + 'WorkItem/NewCustomerPhone', input)
  }

  putChangeTitleWorkItem(input:{workItemId: number, title: string}){
    return this.http.put(this.baseUrl + 'WorkItem/ChangeTitle', input);
  }

}

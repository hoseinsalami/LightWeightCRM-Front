import {Injectable} from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {environment} from "../../../environments/environment";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {FileTypeEnum} from "../../_enums/file-type.enum";
import {Observable, Subject} from "rxjs";
import {AttachmentType, CreateActivityType, CreateAttachmentDTO} from "../../_types/create-activity.type";
import {ActivityWorkItemType, IStructureData} from "../../work-item/_types/activity-workItem.type";
import {NoteType} from "../../work-item/_types/note.type";

@Injectable({
  providedIn: 'root'
})
export class ActivityNoteService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Media'

  private openActivityModalSubject = new Subject<{id:number}>();

  openActivityModal$ = this.openActivityModalSubject.asObservable();

  constructor(private http: FatapHttpClientService) {
    super(http , '');
  }

  openActivityModal(id: number) {
    this.openActivityModalSubject.next({ id });
  }

  uploadFile(fileType:any , formData:FormData):Observable<any>{
    if (fileType === 0) {
      return this.http.post(this.baseUrl + '/Photo/Upload', formData);
    } else if (fileType === 1) {
      return this.http.post(this.baseUrl + '/Doc/Upload', formData);
    } else if (fileType === 2) {
      return this.http.post(this.baseUrl + '/Movie/Upload', formData);
    }
    throw new Error('Invalid file type');
  }

  onAddAttachment(input: any){
    return this.http.post(environment.apiUrl + 'Attachment', input)
  }

  getAttachments(input:{id:any,state:string}):Observable<AttachmentType[]>{
    if (input.state === 'workItem'){
      return this.http.get(environment.apiUrl + `CRM/Attachment/workItem/${input.id}`)
    } else if (input.state === 'customer') {
      return this.http.get(environment.apiUrl + `CRM/Attachment/customer/${input.id}`)
    } else {
      console.warn('Please determine your service status.');
      return null;
    }
  }

  getListOfActivities(input:{id:string,from:number,row:number, state:string}):Observable<IStructureData<ActivityWorkItemType>>{
    if (input.state == 'workItem'){
      return this.http.get(environment.apiUrl + `CRM/Activity/workItem/${input.id}?from=${input.from}&rows=${input.row}`)
    } else {
      return this.http.get(environment.apiUrl + `CRM/Activity/customer/${input.id}?from=${input.from}&rows=${input.row}`)
    }
  }

  getListOfNote(input:{id:string,from:number,row:number, state:string}):Observable<IStructureData<NoteType>>{
    if (input.state == 'workItem') {
      return this.http.get(environment.apiUrl + `CRM/Note/workItem/${input.id}?from=${input.from}&rows=${input.row}`)
    } else {
      return this.http.get(environment.apiUrl + `CRM/Note/customer/${input.id}?from=${input.from}&rows=${input.row}`)
    }
  }

  onDownloadFileAttachment(input:{id:number , title: string}){
    // return this.http.post(environment.apiUrl + 'CRM/Attachment/Download', input , { responseType: 'blob', observe: 'response', });
    return this.http.post(environment.apiUrl + 'Media/Download', input , { responseType: 'blob', observe: 'response', });
  }

  getActivityById(id:number):Observable<CreateActivityType>{
    return this.http.get(environment.apiUrl + `CRM/Activity/${id}`)
  }

  deleteActivity(id:number){
    return this.http.delete(environment.apiUrl + `CRM/Activity/${id}`)
  }

  getNoteById(id:number):Observable<NoteType>{
    return this.http.get(environment.apiUrl + `CRM/Note/${id}`)
  }

  deleteNoteById(id:number):Observable<any>{
    return this.http.delete(environment.apiUrl + `CRM/Note/${id}`)
  }

  deleteAttachmentById(id:number):Observable<any>{
    return this.http.delete(environment.apiUrl + `CRM/Attachment/${id}`)
  }

  changeExpertActivity(input:{activityId: number, userId: number}){
    return this.http.put(environment.apiUrl + 'CRM/Activity/ChangeUser', input);
  }

}

import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {environment} from "../../../environments/environment";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {Observable} from "rxjs";
import {CreateTenantTicketDTO, EditTenantTicketDTO} from "../../setting/_types/createTenantTicketDTO";

@Injectable({
  providedIn: 'root'
})
export class AdminTicketService extends BaseCrudService{
  override baseUrl = environment.apiUrl + 'Management/TenantTicket'

  constructor(private http: FatapHttpClientService) {
    super(http,'')
  }


  getListOfTicket(from:number, row:number){
    return this.http.get(this.baseUrl + `/list?from=${from}&row=${row}`);
  }

  getOne(id:number):Observable<EditTenantTicketDTO>{
    return this.http.get(this.baseUrl + `/${id}`)
  }

  onNewMessage(input:{tenantTicketId:number, content: string, attachments: string[]}):Observable<{ id: number }>{
    return this.http.post(this.baseUrl + '/NewMessage', input)
  }

  onDownloadFile(input:{id:number, title:string}){
    return this.http.post(environment.apiUrl + 'Media/TicketAttachments/Download', input , { responseType: 'blob', observe: 'response', });
  }

  onSave(input:CreateTenantTicketDTO){
    return this.http.post(this.baseUrl , input)
  }

}

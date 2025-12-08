import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {environment} from "../../../environments/environment";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {Observable} from "rxjs";
import {TicketPathConfig} from "../_types/ticketPathConfig";
import {UserTypeBase} from "../_types/user.type";

@Injectable({
  providedIn: 'root'
})
export class TicketConfigService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Management/Ticket'

  constructor(private http: FatapHttpClientService) {
    super(http, '')
  }


  getTicketConfig():Observable<TicketPathConfig[]>{
    return this.http.get(this.baseUrl)
  }

  onUpdateTicketConfig(input:TicketPathConfig[]):Observable<any>{
    return this.http.put(this.baseUrl,input)
  }

  listOfUserExperts(): Observable<UserTypeBase[]>{
    return this.http.get(this.baseUrl + '/experts')
  }

  listOfUserAdmins(): Observable<UserTypeBase[]>{
    return this.http.get(this.baseUrl + '/admins')
  }

}

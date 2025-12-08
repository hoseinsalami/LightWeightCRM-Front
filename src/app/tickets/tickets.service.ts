import { Injectable } from '@angular/core';
import {BaseCrudService} from "../_services/base-crud.service";
import {FatapHttpClientService} from "../_services/fatap-http-client.service";
import {environment} from "../../environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import {TicketBaseType} from "./_types/ticket-base.type";
import {TicketStateEnum} from "../_enums/ticket-state.enum";
import {TicketTypeEnum} from "../_enums/ticket-type.enum";

@Injectable({
  providedIn: 'root'
})
export class TicketsService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'CRM/Ticket';

  constructor(private http: FatapHttpClientService) {
    super(http , '');
  }

  getListOfTicket(ticketId:string ,from:number, rows:number, keyword?:string, ticketState?:any ):Observable<TicketBaseType[]>{
    let ts = '';

    if(ticketState != undefined && ticketState != null)
      ts=`&ticketState=${ticketState}`;
    if (keyword && ticketState >= 0){
      return this.http.get(this.baseUrl + `/${ticketId}?from=${from}&rows=${rows}&keyword=${keyword}`+ts)
    } else if (keyword){
      return this.http.get(this.baseUrl + `/${ticketId}?from=${from}&rows=${rows}&keyword=${keyword}`+ts)
    } else if (ticketState >= 0){
      return this.http.get(this.baseUrl + `/${ticketId}?from=${from}&rows=${rows}`+ts)
    } else {
      return this.http.get(this.baseUrl + `/${ticketId}?from=${from}&rows=${rows}`)
    }
  }

  getDetailTicket(id:any):Observable<TicketBaseType>{
    return this.http.get(this.baseUrl + `/Detail/${id}`)
  }

  onReadTicket(ticketId:number|string){
    return this.http.put(this.baseUrl + `/Read/${ticketId}`,{})
  }

  onCloseTicket(ticketId:number|string){
    return this.http.put(this.baseUrl + `/Close/${ticketId}`,{})
  }

  getListOfTicketUsers(ticketType:string){
    return this.http.get(this.baseUrl + `/experts/${ticketType}`)
  }

  onChangeUserTicket(input:{ticketId:number,userId:number}){
    return this.http.put(this.baseUrl + '/ChangeUser', input)
  }

}

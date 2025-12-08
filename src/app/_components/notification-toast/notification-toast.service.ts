import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {environment} from "../../../environments/environment";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationToastService extends BaseCrudService {

  override baseUrl = environment.apiUrl

  constructor(private http: FatapHttpClientService) {
    super(http , '')
  }


  onConfirmReminderToast(id:number){
    return this.http.put(this.baseUrl + `CRM/Activity/reminderSeen/${id}`, {});
  }

}

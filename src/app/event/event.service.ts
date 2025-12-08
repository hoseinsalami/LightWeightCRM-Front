import { Injectable } from '@angular/core';
import {FatapHttpClientService} from "../_services/fatap-http-client.service";
import {BaseCrudService} from "../_services/base-crud.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EventService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Management/Event';

  constructor(private http: FatapHttpClientService) {
    super(http, '')
  }
}

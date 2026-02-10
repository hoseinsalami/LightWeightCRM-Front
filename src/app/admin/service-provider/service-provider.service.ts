import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Management/SmsProvider'

  constructor(private http: FatapHttpClientService) {
    super(http, '')
  }
}

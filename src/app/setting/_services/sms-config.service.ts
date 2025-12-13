import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {environment} from "../../../environments/environment";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {Observable} from "rxjs";
import {ICommonType} from "../../path/_types/create-work-item.type";

@Injectable({
  providedIn: 'root'
})
export class SmsConfigService extends BaseCrudService {
  override baseUrl = environment.apiUrl + 'CRM/SmsProvider'

  constructor(private http: FatapHttpClientService) {
    super(http , '')
  }

  getSmsProviders():Observable<ICommonType[]>{
    return this.http.get<ICommonType[]>(this.baseUrl + '/SmsProviders');
  }
}

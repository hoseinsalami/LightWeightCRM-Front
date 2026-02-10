import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {BaseCrudService} from "../../_services/base-crud.service";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionsService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Management/Permission'

  constructor(private http: FatapHttpClientService) {
    super(http, '')
  }
}

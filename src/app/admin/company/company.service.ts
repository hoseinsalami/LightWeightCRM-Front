import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {environment} from "../../../environments/environment";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {Observable} from "rxjs";
import {TagTypeBase} from "../../setting/_types/tag.type";
import {PermissionTypeDTO} from "../permissions/_types/permission.type";

@Injectable({
  providedIn: 'root'
})
export class CompanyService extends BaseCrudService{
  override baseUrl = environment.apiUrl + 'Management/Tenant'

  constructor(private http: FatapHttpClientService) {
    super(http, '')
  }

  getPermissions():Observable<{ items:PermissionTypeDTO[], totalRecord:number }>{
    return this.http.get(this.baseUrl + '/Permissions')
  }

}

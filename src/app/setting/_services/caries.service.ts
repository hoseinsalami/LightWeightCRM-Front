import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {UserTypeBase} from "../_types/user.type";
import {CreatePathType} from "../_types/createPath.type";

@Injectable({
  providedIn: 'root'
})
export class CariesService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Management/Path'

  constructor(private http: FatapHttpClientService) {
    super(http , '')
  }

  onCreateNewPath(input: any): Observable<any>{
    return this.http.post(this.baseUrl, input)
  }

  listOfUserExperts(): Observable<UserTypeBase[]>{
    return this.http.get(this.baseUrl + '/experts')
  }

  listOfUserAdmins(): Observable<UserTypeBase[]>{
    return this.http.get(this.baseUrl + '/admins')
  }

  onEditPath(id:number):Observable<CreatePathType>{
    return this.http.get(this.baseUrl + `/${id}`)
  }

}

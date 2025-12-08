import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../_services/base-crud.service";
import {FatapHttpClientService} from "../../_services/fatap-http-client.service";
import {environment} from "../../../environments/environment";
import {UserInfo, UserTypeCreate} from "../_types/user.type";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseCrudService{

  override baseUrl = environment.apiUrl + 'Management/User'

  constructor(private http: FatapHttpClientService) {
    super(http, '')
  }

  onCreateNewUser(input: UserTypeCreate): Observable<UserTypeCreate>{
    return this.http.post(this.baseUrl, input)
  }

  onGetPath(){
    return this.http.get(this.baseUrl + '/Paths')
  }

  onChangePasswordUser(input:{password: string, userId: number}){
    return this.http.put(this.baseUrl + '/ChangePassword', input)
  }

  public userInfo?:UserInfo = undefined;

  sendUserInfo(data: UserInfo): void {
    //this.userInfoSubject.next(data);
    this.userInfo = data;
  }
}

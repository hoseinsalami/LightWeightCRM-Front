import {Injectable} from "@angular/core";
import {FatapHttpClientService} from "./fatap-http-client.service";
import {environment} from "../../environments/environment";
import {ServerResponseType} from "../_types/server-response.type";
import {BehaviorSubject, map, Subject} from "rxjs";
import {LoginOutputSscrmType, LoginOutputType} from "../_types/login-output.type";
import {CaptchaOutputType} from "../_types/captcha-output.type";
import {CaptchaVerifyInputType} from "../_types/captcha-verify-input.type";
import {HttpHeaders, HttpParams} from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    baseUrl = environment.apiUrl + 'Account';
    _token = new BehaviorSubject<LoginOutputSscrmType>(<LoginOutputSscrmType>{});

    constructor(private httpClient:FatapHttpClientService) {

        if(localStorage.getItem(environment.tokenName)) //fetch from local storage
            this._token.next(<LoginOutputSscrmType>(JSON.parse(<string>localStorage.getItem(environment.tokenName))));
    }

    getLoginKey(body:any){
      const data: string = new HttpParams({ fromObject: { ...body } }).toString();

      return this.httpClient.post<string>(this.baseUrl+'/GetLoginKey', data, {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      });
    }

    login(token:string){
        return this.httpClient.get<LoginOutputType>(this.baseUrl+'/login/?token='+token)
            .pipe(map((result) => {
                this._token.next(result);
                localStorage.setItem(environment.tokenName, JSON.stringify(result));
                return result;
            }));
    }

    loginSSCRM(input:any){
    return this.httpClient.post<LoginOutputSscrmType>(this.baseUrl+'/login' , input)
      .pipe(map((result) => {
        this._token.next(result);
        localStorage.setItem(environment.tokenName, JSON.stringify(result));
        return result;
      }));
  }

    logout()
    {
        return this.httpClient.get<void>(this.baseUrl+'/logout')
          .pipe(map(()=>{
            localStorage.removeItem(environment.tokenName);
            this._token.next(<LoginOutputSscrmType>{});
          }));
    }

    get token()
    {
        return this._token;
    }

    hasRoutePermission(permission:string)
    {
        if(this.token.getValue()?.permissions && this.token.getValue()?.permissions?.indexOf("ALL") != -1)
            return true;

        return !!((this.token.getValue()?.permissions && this.token.getValue()?.permissions?.indexOf(permission) != -1)
            || (permission == 'everyOne' && this.token.getValue().token));
    }

}

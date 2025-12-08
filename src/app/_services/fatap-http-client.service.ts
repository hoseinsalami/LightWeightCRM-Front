import {HttpClient} from "@angular/common/http";
import {map, observable, Observable, throwError, throwIfEmpty} from "rxjs";
import {ServerResponseType} from "../_types/server-response.type";
import {Injectable} from "@angular/core";
import {CustomMessageService} from "./custom-message.service";
import {filter} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export  class FatapHttpClientService {

    constructor(private httpClient: HttpClient) {
    }

    public post<T>(url: string,
                   input: any,
                   otherParams: object = {}): Observable<T> {
        return this.httpClient.post<T>(url, input, otherParams);
    }

    public get<T>(url: string): Observable<T> {
        return this.httpClient.get<T>(url);
    }

    public put<T>(url: string, input:any): Observable<void> {
      return this.httpClient.put<void>(url, input);
      //   let x = this.httpClient.put<ServerResponseType<void>>(url, input)
      //           .pipe(map(res=>{
      //               if (res.statusCode == 0)
      //                   return 0;
      //               else {
      //                   let mess: string = '';
      //                   res.errors.forEach((m) => {
      //                       mess += m
      //                   })
      //                   this.messageService.showError(mess);
      //                   return 1;
      //               }
      //           }));
      // return   x.pipe(filter(res=>res == 0)).pipe(map(res => {}));
    }

    public delete<T>(url: string): Observable<void> {
        return  this.httpClient.delete<void>(url);
    }
}

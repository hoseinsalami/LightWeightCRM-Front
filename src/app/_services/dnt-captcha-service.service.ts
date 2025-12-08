import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';


import {DntCaptchaParams} from "../_types/dnt-captcha-params.type";
import {MessageService} from "primeng/api";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DntCaptchaService {
  http: HttpClient = inject(HttpClient);
  baseUrl = environment.apiUrl + 'Account';
  notificationService: MessageService = inject(MessageService);

  getDntCaptchaParams(): Observable<DntCaptchaParams> {
    return this.http.get<DntCaptchaParams>(this.baseUrl+'/CreateDNTCaptchaParams').pipe(
      catchError((err) => {
        if (err.status === 429) {
          this.notificationService.add({summary: 'Too many requests for captcha generation.'});
        }

        return throwError(err);
      })
    );
  }
}

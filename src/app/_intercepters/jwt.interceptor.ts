import {inject} from '@angular/core';
import {
     HttpInterceptorFn,
} from '@angular/common/http';
import {take} from 'rxjs/operators';
import {AuthenticationService} from "../_services/authentication.service";
import {switchMap} from "rxjs";
import {environment} from "../../environments/environment";

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const rawToken = localStorage.getItem(environment.tokenName);

  if (rawToken) {
    const parsed = JSON.parse(rawToken);
    if (parsed?.token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${parsed.token}`
        }
      });
    }
  }

  return next(req);

    // let currentToken: string|null = null;

        // authService.token?.pipe(take(1)).subscribe(token =>{
        //     if(token?.token)
        //         currentToken = token.token;
        //     if (currentToken){
        //         req = req.clone({
        //             setHeaders: {
        //                 Authorization: `Bearer ${currentToken}`
        //             },
        //             // body: { ...request.body as Object ,language: 'fa'},
        //             // setParams:{
        //             //   language: 'fa'
        //             // },
        //             //params: req.params.set('language','fa')
        //         });
        //     }
        //     return next(req);
        // });
    // return next(req);
};

import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import {EMPTY, map, Observable, throwError} from "rxjs";
import {inject} from "@angular/core";
import {catchError, filter} from "rxjs/operators";
import {CustomMessageService} from "../_services/custom-message.service";
import {ServerTimeService} from "../_services/server-time.service";
import {ServerResponseType} from "../_types/server-response.type";
import {Router} from "@angular/router";

export const GeneralMessageInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn
): Observable<HttpEvent<ServerResponseType<any>>> => {

    const messageService = inject(CustomMessageService);
    const serverTimeService = inject(ServerTimeService);
    const router = inject(Router);

    return next(req).pipe(map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {

          const serverTime = event.headers.get('Server-Time');
          serverTimeService.setServerTime(serverTime);

          if (event.body.statusCode && event.body.statusCode != 0) {
                //debugger
              //console.log(event.body)

            if (event.body.statusCode === 401) {
              messageService.showError('اتمام جلسه کاری. لطفاً دوباره وارد شوید');
              router.navigate(['/']);  // یا '/login'
              throw new HttpErrorResponse({ status: -1, error: event.body });
            }

                if(event.body.statusCode == 407){
                    //debugger
                    router.navigateByUrl('/logout');
                    throw new HttpErrorResponse({
                        status: -1,//خطا پردازش شده است
                    });
                }
                let allMess: string = 'جزییات:';
                event.body?.errors?.forEach((err) => {
                    allMess += err
                });
                messageService.showError(allMess);
                throw new HttpErrorResponse({
                    status: -1,//خطا پردازش شده است
                });
            }
            else if (event.body.statusCode == 0){
                return new HttpResponse({body:event.body.data})
            }
            return event;
        }
        return event;
    }),
      catchError((error:HttpErrorResponse) => {
        if (error.status == 401){
          router.navigate(['/']);
        }
        return throwError(() => error);
      })

    );


};

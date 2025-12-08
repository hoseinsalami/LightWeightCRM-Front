import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors} from "@angular/common/http";
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app/app-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import {GeneralMessageInterceptor} from "./app/_intercepters/general-message.interceptor";
import {JwtInterceptor} from "./app/_intercepters/jwt.interceptor";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(AppRoutingModule),
        provideHttpClient(),
         provideHttpClient(withInterceptors([JwtInterceptor/*, CustomErrorInterceptor*/,GeneralMessageInterceptor])),
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        // {
        //     provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi:true
        // },
        ConfirmationService,
        MessageService,
        provideAnimations(),
    ],

})
  .catch(err => console.error(err));

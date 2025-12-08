import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {AuthenticationService} from "./authentication.service";
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  baseUrl: string = environment.apiUrl + 'hubs/';
  jwtForSignalR = '';

  constructor(private authService: AuthenticationService) {
    this.authService.token.subscribe(out => {
      this.jwtForSignalR = out.token
    })
  }


  conenctToServer(hubName: string) {
    return new HubConnectionBuilder()
      .withUrl(this.baseUrl + hubName, {
        accessTokenFactory: () => this.jwtForSignalR,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build()
  }

}

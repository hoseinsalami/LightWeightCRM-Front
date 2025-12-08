import { Injectable } from '@angular/core';
import {SignalRService} from "./signal-r.service";
import {MessageService} from "primeng/api";
import {HubConnection} from "@microsoft/signalr";
import {BehaviorSubject} from "rxjs";
import {CreateActivityType} from "../_types/create-activity.type";
import {TicketBaseType} from "../tickets/_types/ticket-base.type";

@Injectable({
  providedIn: 'root'
})
export class CollectorSignalRService {

  hubConnection!: HubConnection
  hubConnectionTicket!: HubConnection
  newRemindersSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  newReminderDataSubject: BehaviorSubject<CreateActivityType | null> = new BehaviorSubject<CreateActivityType | null>(null);

  newTicketsSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  newTicketDataSubject: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);

  constructor(private signalRService: SignalRService, private messageService: MessageService) { }


  connect(){
    this.hubConnection = this.signalRService.conenctToServer('presence');
    this.hubConnection.start()
      // .then(() => {

      this.hubConnection.on('OnRemindActivity', (activity: any) => {
        console.log(activity);
        this.showMessageNewReminder(activity);
      });

  }

  showMessageNewReminder(activity: CreateActivityType){
    this.newRemindersSubject.next(true);
    this.newReminderDataSubject.next(activity);
  }



  connectTicket(){
    this.hubConnectionTicket = this.signalRService.conenctToServer('presence');
    this.hubConnectionTicket.start();

    this.hubConnectionTicket.on('OnTicketsChange', (ticket: { newTickets:number, ticket:TicketBaseType }) =>{
      console.log(ticket)
      this.showMessageNewTicket(ticket)
    })
  }

  showMessageNewTicket(ticket:any){
    this.newTicketsSubject.next(true);
    this.newTicketDataSubject.next(ticket);
  }

}

import { Component } from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {JalaliDatePipe} from "../_pipes/jalali.date.pipe";
import {BaseListComponent} from "../shared/base-list/base-list.component";
import {EventTypeBase} from "./_types/event.type";
import {EventService} from "./event.service";
import {LoadingService} from "../_services/loading.service";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss',
  standalone: true,
  imports: [
    ToolbarModule,
    SharedModule,
    ButtonModule,
    TableModule,
    RouterLink,
    DialogModule,
    FormsModule,
    InputTextModule,
    JalaliDatePipe
  ]
})
export class EventComponent extends BaseListComponent<EventTypeBase>{

  constructor(
    private eventService: EventService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private router: Router,
    private activeRoute:ActivatedRoute,
    private loading: LoadingService
  ) {
    super(eventService, confirmationService, messageService);
  }

  construct(input: EventTypeBase){
    return new EventTypeBase(input);
  }

}

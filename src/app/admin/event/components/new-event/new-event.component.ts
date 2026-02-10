import { Component } from '@angular/core';
import {EventTypeBase} from "../../_types/event.type";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {CommonModule} from "@angular/common";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FieldsetModule} from "primeng/fieldset";
import {InputSwitchModule} from "primeng/inputswitch";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {EventService} from "../../event.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {BaseEventDetailComponent} from "../base-event-detail/base-event-detail.component";

@Component({
  selector: 'app-new-event',
  templateUrl: '../base-event-detail/base-event-detail.component.html',
  styleUrl: './new-event.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RadioButtonModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
    FieldsetModule,
    InputSwitchModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule
  ]
})
export class NewEventComponent extends BaseEventDetailComponent<EventTypeBase>{
  newManager: BaseNewManager<EventTypeBase>

  constructor(
    private eventService: EventService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager = new BaseNewManager<EventTypeBase>(EventTypeBase, eventService, messageService, {}, router, activeRoute, loading);
    super(manager, eventService, loading)

    manager.OnSuccessfulSave.subscribe((i)=>{
      router.navigate(['./'], {relativeTo:activeRoute.parent})
    });

    this.newManager = manager;

  }

}

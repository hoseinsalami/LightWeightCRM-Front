import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FieldsetModule} from "primeng/fieldset";
import {InputSwitchModule} from "primeng/inputswitch";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {BaseEditManager} from "../../../_classes/base-edit.manager";
import {EventTypeBase} from "../../_types/event.type";
import {EventService} from "../../event.service";
import {CustomMessageService} from "../../../_services/custom-message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../_services/loading.service";
import {BaseEventDetailComponent} from "../base-event-detail/base-event-detail.component";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-edit-event',
  templateUrl: '../base-event-detail/base-event-detail.component.html',
  styleUrl: './edit-event.component.scss',
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
export class EditEventComponent extends BaseEventDetailComponent<EventTypeBase>{
  newManager: BaseEditManager<EventTypeBase, EventTypeBase>

  constructor(
    private eventService: EventService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager =
      new BaseEditManager<EventTypeBase,EventTypeBase>(
        EventTypeBase,
        (input) =>{
          let res = new EventTypeBase(input);
          return res
        }, eventService, messageService, activeRoute, router, loading);

    manager.OnSuccessfulSave.subscribe((i) =>{
      router.navigate(['./'], {relativeTo:this.activeRoute.parent});
    });
    super(manager, eventService ,loading)
  }

}

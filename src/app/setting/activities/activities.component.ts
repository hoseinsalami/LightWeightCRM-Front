import { Component } from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {ActivitiesService} from "../_services/activities.service";
import {LoadingService} from "../../_services/loading.service";
import {ActivityType} from "../_types/activity.type";


@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss',
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
export class ActivitiesComponent extends BaseListComponent<ActivityType>{

  constructor(private activityService: ActivitiesService,
              confirmationService: ConfirmationService,
              messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute,
              private loading: LoadingService) {
    super(activityService, confirmationService, messageService);
  }

  construct(input: any){
    return new ActivityType(input)
  }

}

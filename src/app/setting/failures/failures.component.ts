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
import {FailureTypeList} from "../_types/failure.type";
import {FailuresService} from "../_services/failures.service";
import {LoadingService} from "../../_services/loading.service";

@Component({
  selector: 'app-failures',
  templateUrl: './failures.component.html',
  styleUrl: './failures.component.scss',
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
export class FailuresComponent extends BaseListComponent<FailureTypeList>{

  constructor(private failureService: FailuresService,
              confirmationService: ConfirmationService,
              messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute,
              private loading: LoadingService) {
    super(failureService, confirmationService, messageService);
  }

  construct(input: FailureTypeList) {
    return new FailureTypeList(input)
  }


}

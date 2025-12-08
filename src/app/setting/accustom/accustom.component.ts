import { Component } from '@angular/core';
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {AccustomType} from "../_types/accustom.type";
import {AccustomService} from "../_services/accustom.service";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LoadingService} from "../../_services/loading.service";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";

@Component({
  selector: 'app-accustom',
  templateUrl: './accustom.component.html',
  styleUrl: './accustom.component.scss',
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
export class AccustomComponent extends BaseListComponent<AccustomType>{

  constructor(private accustomService: AccustomService,
              confirmationService: ConfirmationService,
              messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute,
              private loading: LoadingService) {

    super(accustomService, confirmationService, messageService);

  }

  construct(input: AccustomType){
    return new AccustomType(input)
  }


}

import { Component } from '@angular/core';
import {BaseListComponent} from "../shared/base-list/base-list.component";
import {CreateSmsProviderDTO} from "./_types/service-provider.type";
import {ServiceProviderService} from "./service-provider.service";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LoadingService} from "../_services/loading.service";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {JalaliDatePipe} from "../_pipes/jalali.date.pipe";

@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.component.html',
  styleUrl: './service-provider.component.scss',
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
  ],
})
export class ServiceProviderComponent extends BaseListComponent<CreateSmsProviderDTO>{

  constructor(
    private SPService: ServiceProviderService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private loading: LoadingService,
  ) {
    super(SPService, confirmationService, messageService);
  }

  construct(input: CreateSmsProviderDTO){
    return new CreateSmsProviderDTO(input)
  }

}

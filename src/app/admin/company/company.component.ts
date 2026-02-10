import { Component } from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {CompanyService} from "./company.service";
import {LoadingService} from "../../_services/loading.service";
import {CreateTenantDTO} from "./_types/company.type";
import {BaseListComponent} from "../../shared/base-list/base-list.component";

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
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
export class CompanyComponent extends BaseListComponent<CreateTenantDTO> {

  constructor(
    private companyService: CompanyService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private router: Router,
    private activeRoute:ActivatedRoute,
    private loading: LoadingService
  ) {
    super(companyService, confirmationService, messageService);
  }

  construct(input: CreateTenantDTO) {
    return new CreateTenantDTO(input);
  }

}

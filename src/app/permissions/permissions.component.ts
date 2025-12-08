import { Component } from '@angular/core';
import {BaseListComponent} from "../shared/base-list/base-list.component";
import {PermissionTypeDTO} from "./_types/permission.type";
import {PermissionsService} from "./permissions.service";
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
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
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
export class PermissionsComponent extends BaseListComponent<PermissionTypeDTO>{

  constructor(
    private pService: PermissionsService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private loading: LoadingService,
  ) {
    super(pService, confirmationService, messageService);
  }

  construct(input: PermissionTypeDTO){
    return new PermissionTypeDTO(input);
  }

}

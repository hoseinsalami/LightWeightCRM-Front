import { Component } from '@angular/core';
import {BasePermissionDetailComponent} from "../base-permission-detail/base-permission-detail.component";
import {PermissionTypeDTO} from "../../_types/permission.type";
import {BaseNewManager} from "../../../_classes/base-new.manager";
import {PermissionsService} from "../../permissions.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../_services/loading.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";

@Component({
  selector: 'app-new-permission',
  templateUrl: '../base-permission-detail/base-permission-detail.component.html',
  styleUrl: './new-permission.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule
  ]
})
export class NewPermissionComponent extends BasePermissionDetailComponent<PermissionTypeDTO>{
  newManager: BaseNewManager<PermissionTypeDTO>;
  constructor(
    private servicePermission:PermissionsService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService
  ){
    let manager = new BaseNewManager<PermissionTypeDTO>(PermissionTypeDTO,servicePermission,messageService,{}, router, activeRoute,  loading);
    super(manager, servicePermission, loading);
    manager.OnSuccessfulSave.subscribe((i) =>{
      router.navigate(['./'], {relativeTo: activeRoute.parent});
    })

    this.newManager = manager
  }
}

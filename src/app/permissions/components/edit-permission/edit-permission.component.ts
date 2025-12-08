import { Component } from '@angular/core';
import {BasePermissionDetailComponent} from "../base-permission-detail/base-permission-detail.component";
import {PermissionTypeDTO} from "../../_types/permission.type";
import {BaseEditManager} from "../../../_classes/base-edit.manager";
import {PermissionsService} from "../../permissions.service";
import {CustomMessageService} from "../../../_services/custom-message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../_services/loading.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";

@Component({
  selector: 'app-edit-permission',
  templateUrl: '../base-permission-detail/base-permission-detail.component.html',
  styleUrl: './edit-permission.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule
  ]
})
export class EditPermissionComponent extends BasePermissionDetailComponent<PermissionTypeDTO>{

  newManager: BaseEditManager<PermissionTypeDTO,PermissionTypeDTO>
  permissionList:any;
  constructor(private servicePermission:PermissionsService,
              private messageService: CustomMessageService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              loading: LoadingService) {
    let manager = new BaseEditManager<PermissionTypeDTO,PermissionTypeDTO>(
      PermissionTypeDTO,
      (input)=>{
        let res = new PermissionTypeDTO(input);
        return res;
      }, servicePermission, messageService, activeRoute, router, loading);

    manager.OnSuccessfulSave.subscribe({
      next: (out) =>{
        router.navigate(['./'], {relativeTo: this.activeRoute.parent})
      }
    })

    super(manager, servicePermission, loading);
  }


  override get isEditMode(): boolean {
    const id = this.activeRoute.snapshot.params['id'];
    console.log(id)
    return !!id;
  }

}

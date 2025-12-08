import { Component } from '@angular/core';
import {BaseSaveManager} from "../../../_classes/base-save.manager";
import {PermissionsService} from "../../permissions.service";
import {LoadingService} from "../../../_services/loading.service";

@Component({
 template:''
})
export class BasePermissionDetailComponent<T> {

  constructor(protected manager: BaseSaveManager<T>,
              private servicePermissions: PermissionsService,
              protected loading: LoadingService){
  }


  get isEditMode(): boolean {
    return false;
  }

}

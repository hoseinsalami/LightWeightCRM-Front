import {Component, OnInit} from '@angular/core';
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {CompanyService} from "../../company.service";
import {LoadingService} from "../../../../_services/loading.service";
import {PermissionTypeDTO} from "../../../permissions/_types/permission.type";

@Component({
  template:''
})
export class BaseCompaniesDetailComponent<T> implements OnInit{
  isEnglishError:boolean = false;
  // isEditMode: boolean = false;

  confirmPassword?:string;
  permissionList: PermissionTypeDTO[] = [];
  permissionIds:number[] = []
  constructor(protected manager: BaseSaveManager<T>,
              private cService: CompanyService,
              protected loading: LoadingService){}

  ngOnInit() {
    this.getListPermission()
  }

  allowOnlyEnglish(event: KeyboardEvent){
    const char = event.key;
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(char)) {
      event.preventDefault();
      this.isEnglishError = true;
    } else {
      this.isEnglishError = false;
    }
  }

  get isEditMode(): boolean {
    return false;
  }


  getListPermission(){
    this.loading.show();
    this.cService.getPermissions().subscribe({
      next: (out) =>{
        this.loading.hide();
        this.permissionList = out.items
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

}

import {Component, OnInit} from '@angular/core';
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {UserService} from "../../../_services/user.service";
import {LoadingService} from "../../../../_services/loading.service";
import {Utilities} from "../../../../_classes/utilities";
import {UserTypesEnum, UserTypesEnum2LabelMapping} from "../../../../_enums/user-types.enum";
import {UserTypeBase} from "../../../_types/user.type";
import {ActivatedRoute} from "@angular/router";

export class BaseUserDetailComponent<T>{

  pathIds = [];

  userType: any;
  confirmPassword:string;
  isId:boolean = false;
  constructor(protected manager: BaseSaveManager<T>,
              private userService: UserService,
              protected loading: LoadingService,
              protected activeRoute: ActivatedRoute) {
    this.userType = Utilities.ConvertEnumToKeyPairArray(UserTypesEnum , UserTypesEnum2LabelMapping)
    this.activeRoute.params.subscribe(res => {
      if (res['id']){
        this.isId = true;
      }else {
        this.isId = false
      }
    })
    this.getPaths()
  }


  getPaths(){
    this.userService.onGetPath().subscribe((res:any) => {
      this.pathIds = [...res]
    })
  }

  protected onRegister() {

  }

  protected onCancel() {

  }

}

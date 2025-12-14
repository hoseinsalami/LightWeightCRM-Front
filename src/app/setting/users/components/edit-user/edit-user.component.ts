import { Component } from '@angular/core';
import {CardModule} from "primeng/card";
import {ToggleButtonModule} from "primeng/togglebutton";
import {MultiSelectModule} from "primeng/multiselect";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {FilterService, MessageService, SharedModule} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {BaseUserDetailComponent} from "../base-user-detail/base-user-detail.component";
import {UserPath, UserTypeBase, UserTypeDetail, UserTypeUpdate} from "../../../_types/user.type";
import {UserService} from "../../../_services/user.service";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {PasswordModule} from "primeng/password";
import {CommonModule, NgIf} from "@angular/common";

@Component({
  selector: 'app-edit-user',
  templateUrl: './../base-user-detail/base-user-detail.component.html',
  styleUrl: './edit-user.component.scss',
  standalone: true,
  imports: [
    CardModule,
    SharedModule,
    InputTextModule,
    ToggleButtonModule,
    FormsModule,
    MultiSelectModule,
    ButtonModule,
    DropdownModule,
    PasswordModule,
    CommonModule,
    NgIf
  ]
})
export class EditUserComponent extends BaseUserDetailComponent<UserTypeUpdate>{
  newManager: BaseEditManager<UserTypeDetail, UserTypeUpdate>

  constructor(private service: UserService,
              private messageService: MessageService,
              private router: Router,
              activeRoute: ActivatedRoute,
              loading: LoadingService,
              private filterService: FilterService) {
    let manager = new BaseEditManager<UserTypeDetail, UserTypeUpdate>(
      UserTypeDetail,
      (input) =>{

        // input.userPaths.forEach(item => {
        //   this.selectedPathIds.push(item.pathId)
        // })

        let temp = new UserTypeUpdate(input);
        return temp;
      }, service, messageService, activeRoute, router, loading)


    manager.BeforeSave.subscribe((item) => {
      const mobile = this.manager.oneObject.mobile;

      const isValidMobile = /^09\d{9}$/.test(mobile);

      if (!isValidMobile) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'شماره موبایل معتبر نیست.',
        });
        return false;
      }

      manager.OnSuccessfulSave.subscribe((manage) =>{
        router.navigate(['./'], {relativeTo: this.activeRoute.parent})
      });

      return true;

      // item.userPaths=[]
      // // this.selectedPathIds.map((x) =>{
      //   item.userPaths.push(new UserPath ({pathId:x}))
      // })
    })




    super(manager, service, loading, activeRoute);


    this.newManager = manager


  }

}

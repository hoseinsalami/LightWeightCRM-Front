import {Component, OnInit} from '@angular/core';
import {CardModule} from "primeng/card";
import {MessageService, SharedModule} from "primeng/api";
import {InputTextModule} from "primeng/inputtext";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {BaseUserDetailComponent} from "../base-user-detail/base-user-detail.component";
import {UserTypeBase, UserTypeCreate} from "../../../_types/user.type";
import {UserService} from "../../../_services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {PasswordModule} from "primeng/password";
import {CommonModule, NgIf} from "@angular/common";
import {DividerModule} from "primeng/divider";

@Component({
  selector: 'app-new-user',
  templateUrl: '../../components/base-user-detail/base-user-detail.component.html',
  styleUrl: './new-user.component.scss',
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
    NgIf,
    DividerModule
  ]
})
export class NewUserComponent extends BaseUserDetailComponent<UserTypeCreate>{
  newManager:BaseNewManager<UserTypeCreate>;


  constructor(
    private service: UserService,
    private messageService: MessageService,
    private router: Router,
    activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager =
      new BaseNewManager<UserTypeCreate>(UserTypeCreate,service, messageService,{}, router, activeRoute, loading);

    super(manager, service, loading, activeRoute);

    manager.validation = () => {
      const mobile = this.manager.oneObject.mobile;
      const isValidMobile = /^09\d{9}$/.test(mobile);

      if (!this.manager.oneObject.fullName) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'نام و نام خانوادگی اجباری می باشد.',
        });
        return false;
      }

      if (!this.manager.oneObject.userName) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'نام کاربری اجباری می باشد.',
        });
        return false;
      }

      if (this.manager.oneObject.userType == null || this.manager.oneObject.userType == undefined ) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'نوع کاربری اجباری می باشد.',
        });
        return false;
      }

      if (!isValidMobile) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'شماره موبایل وارد شده معتبر نیست.',
        });
        return false;
      }

      if (this.manager.oneObject.password !== this.confirmPassword){
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'رمز عبور و تکرار آن یکسان نیستند.',
        });
        return false;
      }
      return true
    }

    manager.OnSuccessfulSave.subscribe((i)=>{
      router.navigate(['./'], {relativeTo: activeRoute.parent})
    });


    this.newManager = manager;
  }

}

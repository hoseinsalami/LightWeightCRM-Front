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
    NgIf
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



    manager.BeforeSave.subscribe(item => {

      const mobile = this.manager.oneObject.mobile;

      const isValidMobile = /^09\d{9}$/.test(mobile);

      if (!isValidMobile) {
        // نمایش ارور یا جلوگیری از ذخیره
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'شماره موبایل وارد شده معتبر نیست.',
        });
        // جلوگیری از ادامه ذخیره‌سازی
        return false;
      }

      manager.OnSuccessfulSave.subscribe((i)=>{
        router.navigate(['./'], {relativeTo: activeRoute.parent})
      });
      // item.pathIds = [...this.selectedPathIds];
      return true;
    })




    this.newManager = manager;
  }

}

import { Component } from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {UserService} from "../_services/user.service";
import {LoadingService} from "../../_services/loading.service";
import {UserTypeList} from "../_types/user.type";
import {Utilities} from "../../_classes/utilities";
import {UserTypesEnum, UserTypesEnum2LabelMapping} from "../../_enums/user-types.enum";
import {PasswordModule} from "primeng/password";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
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
    JalaliDatePipe,
    PasswordModule,
    TooltipModule
  ]
})
export class UsersComponent extends BaseListComponent<UserTypeList>{

  showDialog=false;
  userType: any;
  showModalChangePassword: boolean = false;
  userId:number;

  newPassword: string | null
  reapNewPassword: string | null;

  constructor(private userService:UserService,
              confirmationService: ConfirmationService,
              messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute,
              private loading: LoadingService) {
    super(userService, confirmationService, messageService);
    this.userType = Utilities.ConvertEnumToKeyPairArray(UserTypesEnum , UserTypesEnum2LabelMapping)
  }

  construct(input: UserTypeList){
    return new UserTypeList(input)
  }

  NewUserClicked() {
    this.showDialog=true;
  }

  onChangePassword(){
    let input = {
      password: '',
      userId: this.userId
    }
    if (this.newPassword || this.reapNewPassword) {

      if (this.newPassword !== this.reapNewPassword) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'رمز عبور جدید با تکرار آن همخوانی ندارد',
        });
        return;
      }

      input.password = this.newPassword;
    }


    this.loading.show()
    this.userService.onChangePasswordUser(input).subscribe(res =>{
      this.loading.hide();
      this.messageService.add({
        severity: 'success',
        summary: 'موفق',
        detail: 'تغییر رمز با موفقیت انجام شد.',
      });
      this.showModalChangePassword = false;
    }, error => {
      this.loading.hide();
    })
  }

  onShowModalChangePassword(userId:number){
    this.showModalChangePassword = true
    this.newPassword = null;
    this.reapNewPassword = null
    this.userId = userId
  }

}

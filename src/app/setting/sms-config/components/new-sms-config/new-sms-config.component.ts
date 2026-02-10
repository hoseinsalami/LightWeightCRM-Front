import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {BaseSmsConfigDetailComponent} from "../base-sms-config-detail/base-sms-config-detail.component";
import {SmsProviderType} from "../../../_types/SmsProvider.type";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {SmsConfigService} from "../../../_services/sms-config.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {InputSwitchModule} from "primeng/inputswitch";
import {KeyFilterModule} from "primeng/keyfilter";
import {DropdownModule} from "primeng/dropdown";
import {AuthenticationService} from "../../../../_services/authentication.service";

@Component({
  selector: 'app-new-sms-config',
  templateUrl: '../base-sms-config-detail/base-sms-config-detail.component.html',
  styleUrl: './new-sms-config.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    InputSwitchModule,
    KeyFilterModule,
    DropdownModule
  ]
})
export class NewSmsConfigComponent extends BaseSmsConfigDetailComponent<SmsProviderType>{
  newManager: BaseNewManager<SmsProviderType>;

  constructor(
    private smsService: SmsConfigService,
    private messageService: MessageService,
    private router: Router,
    activeRoute: ActivatedRoute,
    loading: LoadingService,
    private authService: AuthenticationService
  ) {
    let manager =
      new BaseNewManager<SmsProviderType>(SmsProviderType, smsService, messageService, {}, router, activeRoute, loading);

    super(manager, smsService, loading, activeRoute);

    manager.validation = () =>{
      if (!this.manager.oneObject.smsProviderId) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'سرویس دهنده پیامک اجباری می باشد.',
        });
        return false;
      }

      if (!this.manager.oneObject.apiKey) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: ' .اجباری می باشد API Key ',
        });
        return false;
      }


      if (!this.manager.oneObject.phoneNumber) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'شماره تماس اجباری می باشد.',
        });
        return false;
      }

      return true;
    }

    this.manager.oneObject.tenantId = this.authService.token.getValue().tenantId
    manager.OnSuccessfulSave.subscribe({
      next: (out) =>{
        router.navigate(['./'], {relativeTo: activeRoute.parent});
      }
    })

    this.newManager = manager
  }

}

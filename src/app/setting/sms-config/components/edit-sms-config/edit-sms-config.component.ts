import { Component } from '@angular/core';
import {BaseSmsConfigDetailComponent} from "../base-sms-config-detail/base-sms-config-detail.component";
import {SmsProviderType} from "../../../_types/SmsProvider.type";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {SmsConfigService} from "../../../_services/sms-config.service";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {InputSwitchModule} from "primeng/inputswitch";
import {KeyFilterModule} from "primeng/keyfilter";
import {DropdownModule} from "primeng/dropdown";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-edit-sms-config',
  templateUrl: '../base-sms-config-detail/base-sms-config-detail.component.html',
  styleUrl: './edit-sms-config.component.scss',
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
export class EditSmsConfigComponent extends BaseSmsConfigDetailComponent<SmsProviderType> {
  newManager: BaseEditManager<SmsProviderType,SmsProviderType>

  constructor(
    private smsService: SmsConfigService,
    private messageService: MessageService,
    private router: Router,
    activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager =
      new BaseEditManager<SmsProviderType,SmsProviderType>(
        SmsProviderType,
        (input)=>{
          let res = new SmsProviderType(input)
          return res;
        }, smsService, messageService, activeRoute, router, loading)

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

    manager.BeforeSave.subscribe(i=>{
      delete i.tenantId;
      delete i.isDefault;
    })

    manager.OnSuccessfulSave.subscribe({
      next:(out) =>{
        router.navigate(['./'], {relativeTo: this.activeRoute.parent });
      }
    })

    super(manager, smsService, loading, activeRoute);

    this.newManager = manager;
  }

  override get isEditMode(): boolean {
    const id = this.activeRoute.snapshot.params['id'];
    return !!id;
  }

}

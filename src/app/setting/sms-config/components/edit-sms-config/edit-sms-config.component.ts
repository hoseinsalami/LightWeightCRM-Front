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
    private messageService: CustomMessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager =
      new BaseEditManager<SmsProviderType,SmsProviderType>(
        SmsProviderType,
        (input)=>{
          let res = new SmsProviderType(input)
          return res;
        }, smsService, messageService, activeRoute, router, loading)

    manager.BeforeSave.subscribe(i=>{
      delete i.tenantId;
      delete i.isDefault;
    })

    manager.OnSuccessfulSave.subscribe({
      next:(out) =>{
        router.navigate(['./'], {relativeTo: this.activeRoute.parent });
      }
    })

    super(manager, smsService, loading);

    this.newManager = manager;
  }

  override get isEditMode(): boolean {
    const id = this.activeRoute.snapshot.params['id'];
    return !!id;
  }

}

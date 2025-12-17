import { Component } from '@angular/core';
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {SmsProviderType} from "../_types/SmsProvider.type";
import {SmsConfigService} from "../_services/sms-config.service";
import {ConfirmationService, MessageService} from "primeng/api";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LoadingService} from "../../_services/loading.service";
import {ToolbarModule} from "primeng/toolbar";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {InputSwitchModule} from "primeng/inputswitch";
import {TooltipModule} from "primeng/tooltip";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-sms-config',
  templateUrl: './sms-config.component.html',
  styleUrl: './sms-config.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarModule,
    TableModule,
    RouterLink,
    ButtonModule,
    JalaliDatePipe,
    InputSwitchModule,
    TooltipModule
  ]
})
export class SmsConfigComponent extends BaseListComponent<SmsProviderType>{

  constructor(
    private smsService: SmsConfigService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingService
  ) {
    super(smsService, confirmationService, messageService);

  }

  construct(input: SmsProviderType){
    return new SmsProviderType(input)
  }


  switchAction(event:any ,id:number) {
    this.loading.show();
    this.smsService.putChangeDefault(id).subscribe({
      next:(out) =>{
        this.loading.hide();
        this.lazyLoadData(this.construct,
          this.lastTable,
          { ...this.lastEvent, first: event.first, rows: event.rows },
          this.lastMethodName,
          this.lastOtherParam)
      },
      error: (err) =>{
        this.loading.hide();
        console.log(err)
      }
    });

  }


}

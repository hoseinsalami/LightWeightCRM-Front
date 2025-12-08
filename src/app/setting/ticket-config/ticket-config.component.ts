import {Component, OnInit} from '@angular/core';
import {CommonModule, Location} from "@angular/common";
import {FieldsetModule} from "primeng/fieldset";
import {LoadingService} from "../../_services/loading.service";
import {TicketConfigService} from "../_services/ticket-config.service";
import {ButtonModule} from "primeng/button";
import {UserTypeBase} from "../_types/user.type";
import {TicketPathConfig} from "../_types/ticketPathConfig";
import {Utilities} from "../../_classes/utilities";
import {TimeUnitsEnum, TimeUnitsEnum2LabelMapping} from "../../_enums/TimeUnits.enum";
import {DropdownModule} from "primeng/dropdown";
import {MultiSelectModule} from "primeng/multiselect";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {KeyFilterModule} from "primeng/keyfilter";
import {MessageService} from "primeng/api";
import {CustomMessageService} from "../../_services/custom-message.service";

@Component({
  selector: 'app-ticket-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FieldsetModule,
    ButtonModule,
    DropdownModule,
    MultiSelectModule,
    InputTextModule,
    KeyFilterModule
  ],
  templateUrl: './ticket-config.component.html',
  styleUrl: './ticket-config.component.scss'
})
export class TicketConfigComponent implements OnInit{

  config:TicketPathConfig[];

  adminUsers: UserTypeBase[];
  expertUsers: UserTypeBase[];
  TimeUnits?: any;

  constructor(private loading: LoadingService,
              private service: TicketConfigService,
              private messageService: CustomMessageService,
              private location: Location) {
  }

  ngOnInit() {
    this.TimeUnits = Utilities.ConvertEnumToKeyPairArray(TimeUnitsEnum,TimeUnitsEnum2LabelMapping)
    this.ticketConfigInfo();
    this.getListOfUserAdmins();
    this.getListOfUserExperts();
  }


  ticketConfigInfo(){
    this.loading.show();
    this.service.getTicketConfig().subscribe((res) => {
      this.loading.hide();
      this.config = res
    }, error => {
      this.loading.hide();
    })
  }

  updateTicketConfig(){
    this.loading.show();
    this.service.onUpdateTicketConfig(this.config).subscribe((res) => {
      this.messageService.showSuccess('عملیات با موفقیت انجام شد.')
      this.loading.hide();
      this.ticketConfigInfo();
    }, error => {
      this.loading.hide();
    })
  }

  getListOfUserAdmins() {
    this.loading.show()
    this.service.listOfUserAdmins().subscribe((res) =>{
      this.loading.hide()
      this.adminUsers = res;
    }, error => {
      this.loading.hide();
    })
  }

  getListOfUserExperts() {
    this.loading.show()
    this.service.listOfUserExperts().subscribe((res) =>{
      this.loading.hide();
      this.expertUsers = res
    }, error => {
      this.loading.hide();
    })
  }

  backLocation(){
    this.location.back();
  }

}

import { Component } from '@angular/core';
import {BaseCustomerDetailComponent} from "../base-customer-detail/base-customer-detail.component";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {CustomerService} from "../../../_services/customer.service";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {CardModule} from "primeng/card";
import {MessageService, SharedModule} from "primeng/api";
import {InputTextModule} from "primeng/inputtext";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {PasswordModule} from "primeng/password";
import {CommonModule, Location, NgIf} from "@angular/common";
import {FieldsetModule} from "primeng/fieldset";
import {KeyFilterModule} from "primeng/keyfilter";
import {CreateCustomerPhone, CustomerSpecification} from "../../../../path/_types/create-work-item.type";
import {PanelModule} from "primeng/panel";
import {EditorModule} from "primeng/editor";
import {AutoCompleteModule} from "primeng/autocomplete";
import {WorkItemService} from "../../../../work-item/work-item.service";
import {DomSanitizer} from "@angular/platform-browser";
import {NgPersianDatepickerModule} from "ng-persian-datepicker";
import {JalaliDatePipe} from "../../../../_pipes/jalali.date.pipe";
import {DividerModule} from "primeng/divider";
import {DialogModule} from "primeng/dialog";
import {ActivityNoteComponent} from "../../../../_components/activity-note/activity-note.component";
import {TooltipModule} from "primeng/tooltip";
import {TabViewModule} from "primeng/tabview";
import {InputNumberModule} from "primeng/inputnumber";
import {OverlayPanelModule} from "primeng/overlaypanel";

@Component({
  selector: 'app-edit-customer',
  templateUrl: '../base-customer-detail/base-customer-detail.component.html',
  styleUrl: './edit-customer.component.scss',
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
    FieldsetModule,
    KeyFilterModule,
    PanelModule,
    EditorModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    NgPersianDatepickerModule,
    JalaliDatePipe,
    DividerModule,
    DialogModule,
    ActivityNoteComponent,
    TooltipModule,
    TabViewModule,
    RouterLink,
    InputNumberModule,
    OverlayPanelModule
  ]
})
export class EditCustomerComponent extends BaseCustomerDetailComponent{


  constructor(private customerService: CustomerService,
              private workItem: WorkItemService,
              private messageService: MessageService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              loading: LoadingService,
              private sanitiz:DomSanitizer,
              private customeMessageService: CustomMessageService,
              private locationState: Location) {
    let manager =
      new BaseEditManager<CustomerSpecification,CustomerSpecification>(
        CustomerSpecification,
        (input) =>{
          let temp = new CustomerSpecification(input);
          if (temp.tags && temp.tags.length) {
            this.selectedTags = temp.tags;
          }
          return temp
        } , customerService, messageService, activeRoute, router, loading)

    super(manager, customerService,workItem, loading,sanitiz,customeMessageService,activeRoute,locationState);

    manager.OnSuccessfulSave.subscribe((i) => {
      router.navigate(['./'], {relativeTo: activeRoute.parent})
    });

  }

}

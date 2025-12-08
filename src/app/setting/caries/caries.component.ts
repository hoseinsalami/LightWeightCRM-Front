import {Component, ViewChild} from '@angular/core';
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LoadingService} from "../../_services/loading.service";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {CariesService} from "../_services/caries.service";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FieldsetModule} from "primeng/fieldset";
import {CommonModule} from "@angular/common";
import {OrderList, OrderListModule} from "primeng/orderlist";
import {CreatePathType} from "../_types/createPath.type";

@Component({
  selector: 'app-caries',
  templateUrl: './caries.component.html',
  styleUrl: './caries.component.scss',
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
    InputTextareaModule,
    FieldsetModule,
    CommonModule,
    OrderListModule,
    ReactiveFormsModule,
    JalaliDatePipe
  ]
})
export class CariesComponent extends BaseListComponent<CreatePathType>{

  // @ViewChild('orderList') orderList: OrderList
  // showDialog = false;
  // form: FormGroup;
  // stepsArrayForm: FormArray;
  // value:any;
  constructor(private cariesService: CariesService,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private loading: LoadingService,
              confirmationService: ConfirmationService,
              messageService: MessageService,
              private fb: FormBuilder) {
    super(cariesService, confirmationService, messageService);

  }

  construct(input: CreatePathType){
    return new CreatePathType(input)
  }

}

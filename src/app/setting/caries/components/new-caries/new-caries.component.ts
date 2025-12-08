import {Component, OnInit} from '@angular/core';
import {MessageService, SharedModule} from "primeng/api";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {CariesService} from "../../../_services/caries.service";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FieldsetModule} from "primeng/fieldset";
import {CommonModule} from "@angular/common";
import {OrderListModule} from "primeng/orderlist";
import {JalaliDatePipe} from "../../../../_pipes/jalali.date.pipe";
import {BaseCariesDetailComponent} from "../base-caries-detail/base-caries-detail.component";
import {CreatePathType, CreateStepType} from "../../../_types/createPath.type";
import {DropdownModule} from "primeng/dropdown";
import {DividerModule} from "primeng/divider";
import {MultiSelectModule} from "primeng/multiselect";
import {KeyFilterModule} from "primeng/keyfilter";

@Component({
  selector: 'app-new-caries',
  templateUrl: '../base-caries-detail/base-caries-detail.component.html',
  styleUrl: './new-caries.component.scss',
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
    JalaliDatePipe,
    DropdownModule,
    DividerModule,
    MultiSelectModule,
    KeyFilterModule
  ],
  standalone: true
})
export class NewCariesComponent extends BaseCariesDetailComponent<CreatePathType> implements OnInit {

  constructor(
    private service: CariesService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService,
    fb: FormBuilder
  ) {
    let manager =
      new BaseNewManager<any>(CreatePathType,service, messageService,{}, router, activeRoute, loading);

    super(manager, service, loading);

    manager.OnSuccessfulSave.subscribe((i)=>{
      router.navigate(['./'], {relativeTo: activeRoute.parent})
    });

  }

  ngOnInit() {
    this.onAddNewStep()
  }

  override onAddNewStep() {
    this.manager.oneObject.steps = this.manager.oneObject.steps ? [...this.manager.oneObject.steps, new CreateStepType({}) ] : [new CreateStepType({})]
    this.changeOrder()
  }

  onDeleteStep(input:CreateStepType ){
    if (this.manager.oneObject.steps){
      this.manager.oneObject.steps = this.manager.oneObject.steps.filter(item =>{
        return item != input
      })
    }
  }



  changeOrder(){
    this.manager.oneObject.steps.forEach((data , index) => { data.order = index})
  }

}

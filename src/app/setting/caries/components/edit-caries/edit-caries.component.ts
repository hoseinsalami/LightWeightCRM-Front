import {Component, OnInit} from '@angular/core';
import {BaseCariesDetailComponent} from "../base-caries-detail/base-caries-detail.component";
import {CreatePathType, CreateStepType, UpdatePathType} from "../../../_types/createPath.type";
import {CariesService} from "../../../_services/caries.service";
import {MessageService, SharedModule} from "primeng/api";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FieldsetModule} from "primeng/fieldset";
import {CommonModule} from "@angular/common";
import {OrderListModule} from "primeng/orderlist";
import {JalaliDatePipe} from "../../../../_pipes/jalali.date.pipe";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {UserTypeDetail, UserTypeUpdate} from "../../../_types/user.type";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {DropdownModule} from "primeng/dropdown";
import {DividerModule} from "primeng/divider";
import {MultiSelectModule} from "primeng/multiselect";
import {KeyFilterModule} from "primeng/keyfilter";
import {TooltipModule} from "primeng/tooltip";
import {TabViewModule} from "primeng/tabview";

@Component({
  selector: 'app-edit-caries',
  templateUrl: '../base-caries-detail/base-caries-detail.component.html',
  styleUrl: './edit-caries.component.scss',
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
    JalaliDatePipe,
    DropdownModule,
    DividerModule,
    MultiSelectModule,
    KeyFilterModule,
    TooltipModule,
    TabViewModule
  ],
})
export class EditCariesComponent extends BaseCariesDetailComponent<CreatePathType> implements OnInit {
  newManager: BaseEditManager<CreatePathType, UpdatePathType>

  constructor(
    private service: CariesService,
    private messageService: MessageService,
    private router: Router,
    activeRoute: ActivatedRoute,
    loading: LoadingService,
    fb: FormBuilder
  ) {
    let manager =
      new BaseEditManager<CreatePathType, UpdatePathType>(
        CreatePathType,
        (input) =>{
          let temp = new UpdatePathType(input);

          temp.pathExpertIds = input.pathExperts.map(e => e.id)
          temp.pathAdminId = input.pathAdmin?.id

          return temp;
        }, service, messageService, activeRoute , router ,loading);

    super(manager, service, loading,activeRoute);
    manager.validation = () =>{
      if (!this.manager.oneObject.title) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'عنوان کاریز اجباری می باشد.',
        });
        return false;
      }

      if (!this.manager.oneObject.pathAdminId) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'راهبر اجباری می باشد.',
        });
        return false;
      }

      if (!this.manager.oneObject.pathExpertIds) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'کارشناس اجباری می باشد.',
        });
        return false;
      }

      return true;
    }

    manager.BeforeSave.subscribe(x =>{
      delete this.newManager.oneObject.pathExperts
      delete  this.newManager.oneObject.pathAdmin
    })

    manager.OnSuccessfulSave.subscribe((i)=>{
      router.navigate(['./'], {relativeTo: activeRoute.parent})
    });

    this.newManager = manager;

  }

  ngOnInit() {
    this.onAddNewStep()
  }

  override onAddNewStep() {
    this.manager.oneObject.steps = this.manager.oneObject.steps ? [new CreateStepType({}), ...this.manager.oneObject.steps] : [new CreateStepType({})];
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

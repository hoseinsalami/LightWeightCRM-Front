import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {InputNumberModule} from "primeng/inputnumber";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {DividerModule} from "primeng/divider";
import {StepperModule} from "primeng/stepper";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputSwitchModule} from "primeng/inputswitch";
import {TreeSelectModule} from "primeng/treeselect";
import {DialogModule} from "primeng/dialog";
import {RadioButtonModule} from "primeng/radiobutton";
import {NgPersianDatepickerModule} from "ng-persian-datepicker";
import {MultiSelectModule} from "primeng/multiselect";
import {TabViewModule} from "primeng/tabview";
import {FieldsetModule} from "primeng/fieldset";
import {
  BaseProcessAutomationDetailComponent
} from "../base-process-automation-detail/base-process-automation-detail.component";
import {CreateProcessType} from "../../../_types/CreateProcess.type";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {ProcessAutmationService} from "../../../_services/process-autmation.service";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {CreatePathType, UpdatePathType} from "../../../_types/createPath.type";
import {MessageService} from "primeng/api";
import {AccordionModule} from "primeng/accordion";

@Component({
  selector: 'app-edit-process-automation',
  templateUrl: '../base-process-automation-detail/base-process-automation-detail.component.html',
  styleUrl: './edit-process-automation.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    TooltipModule,
    DividerModule,
    StepperModule,
    InputTextareaModule,
    InputSwitchModule,
    TreeSelectModule,
    DialogModule,
    RadioButtonModule,
    NgPersianDatepickerModule,
    MultiSelectModule,
    TabViewModule,
    FieldsetModule,
    AccordionModule
  ],
})
export class EditProcessAutomationComponent extends BaseProcessAutomationDetailComponent<CreateProcessType> {
  newManager: BaseEditManager<CreateProcessType, CreateProcessType>
  constructor(
    private service: ProcessAutmationService,
    csutomeMessageService: CustomMessageService,
    messageService: MessageService,
    router: Router,
    activeRoute: ActivatedRoute,
    loading: LoadingService,
  ) {

    let manager =
      new BaseEditManager<CreateProcessType,CreateProcessType>(
        CreateProcessType,
        (input) =>{
          let res = new CreateProcessType(input);
          return res;
        },service, csutomeMessageService, activeRoute , router ,loading);
    super(manager, service, loading, messageService, router, activeRoute);

    manager.OnSuccessfulSave.subscribe((i)=>{
      router.navigate(['./'], {relativeTo: activeRoute.parent})
    });

    this.newManager = manager;
  }

}

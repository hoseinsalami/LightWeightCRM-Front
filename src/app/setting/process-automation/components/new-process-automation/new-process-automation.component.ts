import {Component, ElementRef, ViewChild} from '@angular/core';
import {CreateProcessType, IAppAction, IEvent, SendSms} from "../../../_types/CreateProcess.type";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  FieldFilterDescriptor,
  FilterField,
  FilterGroup,
  IFilterParameters,
  ValuePathAccess
} from "../../../_types/filter.type";
import {ITreeNodeModal} from "../../process-automation.component";
import {DropdownChangeEvent, DropdownModule} from "primeng/dropdown";
import {IActiveDate, NgPersianDatepickerModule} from "ng-persian-datepicker";
import {ProcessAutmationService} from "../../../_services/process-autmation.service";
import {LoadingService} from "../../../../_services/loading.service";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {CommonModule} from "@angular/common";
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
import {MultiSelectModule} from "primeng/multiselect";
import {TabViewModule} from "primeng/tabview";
import {FieldsetModule} from "primeng/fieldset";
import {
  BaseProcessAutomationDetailComponent
} from "../base-process-automation-detail/base-process-automation-detail.component";
import {CariesService} from "../../../_services/caries.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {CreatePathType} from "../../../_types/createPath.type";
import {AccordionModule} from "primeng/accordion";

type FieldType = 'string' | 'number' | 'boolean' | 'datetime' | 'enum' | 'object' | 'array';
type ModalType = 'action' | 'tree';
interface FilterCondition {
  value?: any;
  matchMode?: string;
  operator?: string;
}

interface FilterNode {
  key: string;         // معادل انگلیسی
  label: string;       // معادل فارسی
  fullLabel: string;       // اسم پدر(اسم فرزند)
  fullPath: string;
  isLeaf: boolean;
  type?: FieldType;
  enumOptions?: string[];
  values?: any[];
  children?: FilterNode[];
  expanded?: boolean;
  conditions?: FilterCondition[];
  filter?: FilterGroup[];
  selectedValue?: any;
  parent?: FilterNode;
}

interface ActionFilterModal {
  id: string;
  visible: boolean;
  parameters: any[];
  filterGroup: FilterGroup
  outputValuePath?:any;
  selectedParamRadio?:string;

  parentModalId?: string;
  parentModalType?: ModalType;
}

@Component({
  selector: 'app-new-process-automation',
  templateUrl: '../base-process-automation-detail/base-process-automation-detail.component.html',
  styleUrl: './new-process-automation.component.scss',
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
export class NewProcessAutomationComponent extends BaseProcessAutomationDetailComponent<CreateProcessType>{

  constructor(private service: ProcessAutmationService,
              messageService: MessageService,
              router: Router,
              activeRoute: ActivatedRoute,
              loading: LoadingService,) {
    let manager =
      new BaseNewManager<any>(CreateProcessType,service, messageService,{}, router, activeRoute, loading);

    super(manager, service, loading, messageService, router, activeRoute);

    manager.OnSuccessfulSave.subscribe((i)=>{
      router.navigate(['./'], {relativeTo: activeRoute.parent})
    });
  }

}

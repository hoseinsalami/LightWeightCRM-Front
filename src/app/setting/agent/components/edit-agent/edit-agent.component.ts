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
import {AccordionModule} from "primeng/accordion";
import {AgentService} from "../../../_services/agent.service";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../../../../_services/loading.service";
import {BaseAgentDetailComponent} from "../base-agent-detail/base-agent-detail.component";
import {AgentType} from "../../../_types/agent.type";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";

@Component({
  selector: 'app-edit-agent',
  templateUrl: '../base-agent-detail/base-agent-detail.component.html',
  styleUrl: './edit-agent.component.scss',
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
export class EditAgentComponent extends BaseAgentDetailComponent<AgentType>{

  constructor(
    private agentServices: AgentService,
    private messageServices: MessageService,
    private routerr: Router,
    private activeRoutee: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager =
      new BaseEditManager<AgentType,AgentType>(
        AgentType,
        (input)=>{
          let res = new AgentType(input);
          return res;
        }, agentServices, messageServices, activeRoutee, routerr, loading);

    manager
      .OnSuccessfulSave
      .subscribe((i) =>{
        routerr.navigate(['./'], {relativeTo:this.activeRoutee.parent});
      });

    super(manager, agentServices, messageServices, routerr, activeRoutee, loading);

  }


}

import {Component, OnInit} from '@angular/core';
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {AgentService} from "../_services/agent.service";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {Router, RouterLink} from "@angular/router";
import {LoadingService} from "../../_services/loading.service";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {AgentTimeUnitsEnum, AgentTimeUnitsEnum2LabelMapping, AgentType} from "../_types/agent.type";
import {Utilities} from "../../_classes/utilities";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss',
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
    JalaliDatePipe,
    TooltipModule,
  ]
})
export class AgentComponent extends BaseListComponent<AgentType> implements OnInit{

  agentTimeUnits?: any

  constructor(
    private agentService: AgentService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private router: Router,
    private loading: LoadingService
  ) {
    super(agentService, confirmationService, messageService);
    this.agentTimeUnits = Utilities.ConvertEnumToKeyPairArray(AgentTimeUnitsEnum,AgentTimeUnitsEnum2LabelMapping)
  }

  construct(input : AgentType){
    return new AgentType(input)
  }


  ngOnInit() {
  }


  getListOfAgent(){}


}

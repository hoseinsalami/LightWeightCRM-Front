import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../../_services/loading.service";
import {TenantTicketService} from "../_services/tenant-ticket.service";
import {CommonModule} from "@angular/common";
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {Table, TableLazyLoadEvent, TableModule} from "primeng/table";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {PanelModule} from "primeng/panel";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {PaginatorModule} from "primeng/paginator";
import {DividerModule} from "primeng/divider";
import {TooltipModule} from "primeng/tooltip";
import {InputTextareaModule} from "primeng/inputtextarea";
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {CustomerSpecification} from "../../path/_types/create-work-item.type";
import {CreateTenantTicketDTO} from "../_types/createTenantTicketDTO";
import {Utilities} from "../../_classes/utilities";
import {TicketStateEnum, TicketStateEnum2LabelMapping} from "../../_enums/ticket-state.enum";

@Component({
  selector: 'app-tenant-ticket',
  templateUrl: './tenant-ticket.component.html',
  styleUrl: './tenant-ticket.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    SharedModule,
    ButtonModule,
    TableModule,
    RouterLink,
    DialogModule,
    FormsModule,
    InputTextModule,
    JalaliDatePipe,
    PanelModule,
    OverlayPanelModule,
    PaginatorModule,
    DividerModule,
    TooltipModule,
    InputTextareaModule
  ]
})
export class TenantTicketComponent extends BaseListComponent<CreateTenantTicketDTO> implements OnInit {

  stateEnum?: any;
  stateEnumValue = TicketStateEnum;
  constructor(
    private tenantTicketService: TenantTicketService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingService) {
    super(tenantTicketService, confirmationService, messageService);
    this.stateEnum = Utilities.ConvertEnumToKeyPairArray(TicketStateEnum,TicketStateEnum2LabelMapping);
    console.log(this.stateEnum)
  }

  ngOnInit(){
    // this.getListOfTenantTicket()
  }

  construct(input:CreateTenantTicketDTO){
    return new CreateTenantTicketDTO(input);
  }


  getListOfTenantTicket(event: TableLazyLoadEvent = {},table?: Table,){
    this.loading.show();
    this.tableLoading = true;
    this.tenantTicketService.getListOfTicket(event.first,event.rows).subscribe({
      next: (out:any) => {
        this.loading.hide();
        this.tableLoading = false;
        this.totalRecords = out.totalRecords;
        this.many = out.items;
      },
      error: (err) =>{
        this.loading.hide();
        this.tableLoading = false;
      }
    });

    this.lastTable=table;
    this.lastEvent=event;

  }


  openDetails(id){
    this.router.navigate(['setting/tenantTicket/conversation/', id]);
  }

  onPageChange(event: any) {
    this.getListOfTenantTicket(
      { ...this.lastEvent, first: event.first, rows: event.rows },
      this.lastTable,
    );
  }


}

import {Component, OnInit} from '@angular/core';
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {CreateTenantTicketDTO} from "../../setting/_types/createTenantTicketDTO";
import {TenantTicketService} from "../../setting/_services/tenant-ticket.service";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LoadingService} from "../../_services/loading.service";
import {CommonModule} from "@angular/common";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {Table, TableLazyLoadEvent, TableModule} from "primeng/table";
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
import {AdminTicketService} from "./admin-ticket.service";

@Component({
  selector: 'app-admin-tickets',
  templateUrl: './admin-tickets.component.html',
  styleUrl: './admin-tickets.component.scss',
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
export class AdminTicketsComponent extends BaseListComponent<CreateTenantTicketDTO> implements OnInit {


  constructor(
    private adminTicketService: AdminTicketService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingService) {
    super(adminTicketService, confirmationService, messageService);
  }

  construct(input:CreateTenantTicketDTO){
    return new CreateTenantTicketDTO(input);
  }

  ngOnInit() {
  }


  getListOfTenantTicket(event: TableLazyLoadEvent = {},table?: Table,){
    this.loading.show();
    this.tableLoading = true;
    this.adminTicketService.getListOfTicket(event.first,event.rows).subscribe({
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

  }

}

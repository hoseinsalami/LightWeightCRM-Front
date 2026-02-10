import {Component, OnInit} from '@angular/core';
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {DocumentModelType} from "../_types/document.type";
import {DocumentService} from "../_services/document.service";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {LoadingService} from "../../_services/loading.service";
import {CommonModule} from "@angular/common";
import {ToolbarModule} from "primeng/toolbar";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {RouterLink} from "@angular/router";
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

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrl: './document.component.scss',
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
export class DocumentComponent extends BaseListComponent<DocumentModelType> implements OnInit{

  constructor(
    private documentService: DocumentService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private loading: LoadingService
  ) {
    super(documentService, confirmationService,messageService)
  }

  ngOnInit() {
  }

  construct(input:DocumentModelType){
    return new DocumentModelType(input);
  }


}

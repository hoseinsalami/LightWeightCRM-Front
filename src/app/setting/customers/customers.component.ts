import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CustomerService} from "../_services/customer.service";
import {LoadingService} from "../../_services/loading.service";
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, MessageService, SharedModule, TableState} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {Table, TableModule} from "primeng/table";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {BaseListComponent} from "../../shared/base-list/base-list.component";
import {CreateCustomerPhone, CustomerSpecification} from "../../path/_types/create-work-item.type";
import {ConfirmPopup, ConfirmPopupModule} from "primeng/confirmpopup";
import {CommonModule} from "@angular/common";
import {OverlayPanel, OverlayPanelModule} from "primeng/overlaypanel";
import {PanelModule} from "primeng/panel";
import {PaginatorModule} from "primeng/paginator";
import {DividerModule} from "primeng/divider";
import {TooltipModule} from "primeng/tooltip";
import {TagTypeBase} from "../_types/tag.type";
import {SendMessageType} from "../../path/_types/send-message.type";
import {InputTextareaModule} from "primeng/inputtextarea";

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
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
export class CustomersComponent extends BaseListComponent<CustomerSpecification> implements OnInit{

  showPhonePopup = true;
  customerPhones:CreateCustomerPhone[] = [];
  listOfTag:TagTypeBase[] = [];
  showTableHaveFilter = false;
  tagId?:number;
  @ViewChildren('phonePanel') phonePanels!: QueryList<OverlayPanel>;
  constructor(private customerService: CustomerService,
              confirmationService: ConfirmationService,
              messageService: MessageService,
              private router: Router,
              private route: ActivatedRoute,
              private loading: LoadingService) {
    super(customerService, confirmationService, messageService);
  }

  ngOnInit() {
    this.getListOfTag()
  }

  construct(input: CustomerSpecification){
    return new CustomerSpecification(input)
  }

  previousPanel: any = null;
  showCustomerPhone(event: Event, phones: any, panel: OverlayPanel) {
    event.stopPropagation();
    event.preventDefault();
    this.phonePanels.forEach(p => {
      // p ممکنه هنوز undefined باشه در اولین render، اما forEach امنه
      if (p && p !== panel) {
        p.hide();
      }
    });

    this.customerPhones = phones || [];
    panel.toggle(event);
  }

  checkFilter(table: Table): boolean {
    if (table.filteredValue !== null) {
      return true
    } else return false

  }

  onStateRestore(event: TableState) {
    if (event.filters) {
      let find = false
      for (let item of Object.entries(event.filters)) {
        // @ts-ignore
        for (let x of item[1]) {
          if (x.value) {
            find = true
            break;
          }
        }
        this.showTableHaveFilter = find;
      }
    }

  }

  onFilterTable(event: any) {
    this.showTableHaveFilter = this.checkFilter(event)
  }

  clear(table: Table) {
    localStorage.removeItem('customerTable')
    table.clear()
    if (table.filters) {
      let find = false
      for (let item of Object.entries(table.filters)) {
        // @ts-ignore
        for (let x of item[1]) {
          if (x.value) {
            find = true
            break;
          }
        }
        this.showTableHaveFilter = find;
      }
    }
  }

  onPageChange(event: any) {
    this.lazyLoadData(
      this.lastConstruct,
      this.lastTable,
      { ...this.lastEvent, first: event.first, rows: event.rows },
      this.lastMethodName,
      this.lastOtherParam
    );
  }


  getListOfTag(){
    this.loading.show();
    this.customerService.getTagsWorkItem().subscribe({
      next: (out) => {
        this.loading.hide();
        this.listOfTag = out.items
      },
      error: (err) => {
        this.loading.hide();
      }
    })
  }


  copyPhone(phone:string){
    if (!phone) return;

    navigator.clipboard.writeText(phone).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'کپی شد',
        detail: `${phone} در کلیپ‌بورد قرار گرفت`
      });
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'خطا',
        detail: 'کپی کردن شماره انجام نشد'
      });
    });
  }

  getTooltipTags(tags: any[]): string {
    return tags.map(t => t.title).join(' ، ');
  }


  changeCustomerByTag(event:any,tagId: number) {
    this.lazyLoadData(
      this.lastConstruct,
      this.lastTable,
      { ...this.lastEvent, first: event.first, rows: event.rows },
      `/list?tagId=${tagId}`,
      this.lastOtherParam
    );
  }

  removeFilterTag(event:any){
    this.tagId = null;
    this.lastMethodName ='/list'
    this.lazyLoadData(
      this.lastConstruct,
      this.lastTable,
      { ...this.lastEvent, first: event.first, rows: event.rows },
      this.lastMethodName,
      this.lastOtherParam
    );
  }

  showMoreTags(event: MouseEvent, moreTagsPanel: OverlayPanel) {
    event.stopPropagation();
    event.preventDefault();
    moreTagsPanel.toggle(event);
  }



  isDragging = false;
  dragMoved = false;
  startX = 0;
  scrollLeft = 0;
  activeContainer: HTMLElement | null = null;

  startDrag(event: MouseEvent) {
    this.isDragging = true;
    this.dragMoved = false;

    const container = event.currentTarget as HTMLElement;
    this.activeContainer = container;

    container.classList.add('dragging');

    this.startX = event.pageX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
  }

  onDrag(event: MouseEvent) {
    if (!this.isDragging || !this.activeContainer) return;

    const x = event.pageX - this.activeContainer.offsetLeft;
    const walk = (x - this.startX) * 1;
    if (Math.abs(walk) > 5) {
      this.dragMoved = true;
    }

    this.activeContainer.scrollLeft = this.scrollLeft - walk;
  }

  endDrag(event: MouseEvent) {

    if (!this.activeContainer) return;

    this.isDragging = false;
    this.activeContainer.classList.remove('dragging');
    this.activeContainer = null;

  }


  openDetails(id:any) {
    if (this.dragMoved) {
      this.dragMoved = false;
      return;
    }
    this.router.navigate(['setting/customers/edit', id]);

  }

  showDialogSms:boolean = false
  dataMessage:SendMessageType = {}
  openDialogSms(data:any, phone:any){
    this.showDialogSms = true
    this.dataMessage = {}
    this.dataMessage.platform = 0
    this.dataMessage.phoneNumber = phone.phoneNumber
    this.dataMessage.workItemId = null;
    this.dataMessage.customerId = data?.id;
    this.dataMessage.sendDateTime = null;
  }

  onSendMessage(){
    this.loading.show();
    this.customerService.sendMessage(this.dataMessage).subscribe({
      next: (out) => {
        this.loading.hide();
        this.messageService.add({severity: 'success', summary: 'موفق', detail: 'عملیات با موفقیت انجام شد.',})
        this.showDialogSms = false;
      },
      error: (err) => {
        this.loading.hide();
        this.showDialogSms = false;
      }
    })
  }

}

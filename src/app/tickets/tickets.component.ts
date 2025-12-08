import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener, OnChanges,
  OnInit,
  QueryList, SimpleChanges,
  ViewChildren
} from '@angular/core';
import {TicketsService} from "./tickets.service";
import {LoadingService} from "../_services/loading.service";
import {TicketBaseType, CustomerFeelsEnum2LabelMapping} from "./_types/ticket-base.type";
import {CommonModule, NgFor} from "@angular/common";
import {JalaliDatePipe} from "../_pipes/jalali.date.pipe";
import {ButtonModule} from "primeng/button";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ToolbarModule} from "primeng/toolbar";
import {TicketStateEnum} from "../_enums/ticket-state.enum";
import {InputTextModule} from "primeng/inputtext";
import {Utilities} from "../_classes/utilities";
import {TicketTypeEnum, TicketTypeEnum2LabelMapping} from "../_enums/ticket-type.enum";
import {TabViewChangeEvent, TabViewModule} from "primeng/tabview";
import moment from "jalali-moment";
import {DialogModule} from "primeng/dialog";
import {WorkItemService} from "../work-item/work-item.service";
import {UserTypeBase} from "../setting/_types/user.type";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {CustomMessageService} from "../_services/custom-message.service";
import {TooltipModule} from "primeng/tooltip";
import {environment} from "../../environments/environment";
import {take} from "rxjs/operators";
import {AuthenticationService} from "../_services/authentication.service";
import {LoginOutputSscrmType} from "../_types/login-output.type";
import {UserTypesEnum} from "../_enums/user-types.enum";
import {ServerTimeService} from "../_services/server-time.service";
import {OverlayPanelModule} from "primeng/overlaypanel";
@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    JalaliDatePipe,
    ButtonModule,
    RouterLink,
    AutoCompleteModule,
    ToolbarModule,
    InputTextModule,
    TabViewModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    TooltipModule,
    OverlayPanelModule
  ],
  providers:[JalaliDatePipe]
})
export class TicketsComponent implements OnInit, AfterViewInit{

  ticket:TicketBaseType[] = [];
  ticketFilter: TicketBaseType = new TicketBaseType({})

  activeItem: number = null;
  isActiveItem: boolean;
  ticketType:any;
  ticketTypeValue:number = 0;

  @ViewChildren('ticketItem', { read: ElementRef }) ticketItems!: QueryList<ElementRef>;
  observer!: IntersectionObserver;

  showModal:boolean = false;
  userList: any;
  selectedUser:any
  ticketId:any

  ticketTypeId:any
  paginationData = { from: 0, rows: 20, isLoading: false, hasMore: true };
  user:LoginOutputSscrmType|undefined = undefined;
  protected readonly UserTypesEnum = UserTypesEnum
  protected readonly CustomerFeelsEnum2LabelMapping = CustomerFeelsEnum2LabelMapping;

  tabs = [
    { key: 'all', title: 'همه', loader:() => this.setActive(null) },
    { key: 'new', title: 'جدید', loader:() => this.setActive(0) },
    { key: 'current', title: 'جاری', loader:() => this.setActive(1) },
    { key: 'close', title: 'بسته شده', loader:() => this.setActive(2) }
  ];

  constructor(
    private service: TicketsService,
    private workItemService: WorkItemService,
    private authService:AuthenticationService,
    private serverTimeService: ServerTimeService,
    private loading: LoadingService,
    private messagesService: CustomMessageService,
    private router: Router,
    private jalaliPipe: JalaliDatePipe,
    private activatedRoute: ActivatedRoute) {

    this.ticketType = Utilities.ConvertEnumToKeyPairArray(TicketTypeEnum,TicketTypeEnum2LabelMapping);
    authService.token?.pipe(take(1)).subscribe(token => {
      this.user = token
    });

  }

  ngOnInit() {
    console.log(this.router.url)
    this.activatedRoute.params.subscribe((res) =>{
      if (res['id']){
        this.ticketTypeId = res['id']
        this.ticket = [];
        this.paginationData = { from: 0, rows: 20, isLoading: false, hasMore: true };
        this.loadMoreTickets('', this.activeItem);
        this.getListOfUsers()
      }
    });


    // this.loadMoreTickets();
    // this.setActive(0);
  }


  ngAfterViewInit() {}


  loadMoreTickets(event?: string, TicketState:any = this.activeItem) {
    if (this.paginationData.isLoading || !this.paginationData.hasMore || (this.ticket.length < this.paginationData.from)) {
      return;
    }

    this.paginationData.isLoading = true;
    this.loading.show();
    this.service.getListOfTicket(this.ticketTypeId,this.paginationData.from, this.paginationData.rows, event, TicketState).subscribe((res: any[]) => {
      this.loading.hide();
      this.paginationData.isLoading = false;

      if (res.length > 0) {

        this.ticket = [...this.ticket, ...res];
        this.paginationData.from += res.length;

      }

      if (res.length < this.paginationData.rows) {
        this.paginationData.hasMore = false;
      }
    }, error => {
      this.loading.hide();
      this.paginationData.isLoading = false;
    });
  }

  // @HostListener('window:scroll',[])
  onScroll(event: any){
    const element = event.target;
    if (!this.paginationData.isLoading &&
      this.paginationData.hasMore &&
      element.scrollHeight - element.scrollTop <= element.clientHeight + 100) {
      this.loadMoreTickets();
    }
  }

  selectedFilterTicket(filter: any){
    this.ticketFilter.id = filter.value.id
  }

  onInputChange(event: KeyboardEvent) {
    if (event.key === 'Enter'){
      event.preventDefault()
      this.ticket = [];
      this.paginationData = { from: 0, rows: 20, isLoading: false, hasMore: true };
      const query = (event.target as HTMLInputElement ).value || '';
      this.loadMoreTickets( query );
    }

  }

  setActive(item: number| null) {
    this.paginationData = {
      from: 0,
      rows: 20,
      isLoading: false,
      hasMore: true
    };
    this.ticket = [];

    if (this.activeItem === item && !this.isActiveItem){
      this.isActiveItem = true;
      this.activeItem = null;
      this.loadMoreTickets()
    } else {
      this.activeItem = item;
      this.isActiveItem = false;
      this.loadMoreTickets('',this.activeItem)
    }
  }

  ticketDetails(ticketId:number) {
    this.router.navigateByUrl(`tickets/${this.ticketTypeId}/`+ ticketId)
  }

  activeTabIndex = 0
  changeTabTicket(event: TabViewChangeEvent) {
    this.activeTabIndex = event.index
    const tab = this.tabs[event.index];
    if (tab && tab.loader){
      tab.loader()
    }
    // this.ticketTypeValue = this.ticketType[event.index].value;
    // this.paginationData = { from: 0, rows: 20, isLoading: false, hasMore: true };
    // this.ticket = []
    // this.loadMoreTickets();
  }

  calculateDaysDifference(inputDate: string | null){
    if (!inputDate) {
      console.warn("تاریخ ورودی معتبر نیست.");
      return 0;
    }
    const serverTimeStr  = this.serverTimeService.getServerTime();
    const givenDate = moment(inputDate);       // تاریخ میلادی
    const serverTime  = moment(serverTimeStr.replace(' ','T'));                    // تاریخ لحظه‌ای

    const diff = serverTime.diff(givenDate, 'days'); // اختلاف روز
    return diff >= 0 ? `${diff} روز گذشته` : `${Math.abs(diff)} روز مانده`;
  }

  isDeadlinePassed(deadline: string){
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return now > deadlineDate;
  }

  // لیست کارشناس ها
  getListOfUsers(){
    this.loading.show();
    this.service.getListOfTicketUsers(this.ticketTypeId).subscribe((res) =>{
      this.loading.hide();
      this.userList = res;
    }, error => {
      this.loading.hide();
    })
  }

  onSave(){
    this.loading.show();
    const input = {
      ticketId: this.ticketId,
      userId: this.selectedUser
    }
    this.service.onChangeUserTicket(input).subscribe({
      next: () => {
        this.loading.hide();
        this.messagesService.showSuccess('عملیات با موفقیت انجام شد.')
        this.ticket = [];
        this.paginationData = { from: 0, rows: 20, isLoading: false, hasMore: true };
        this.loadMoreTickets('', this.activeItem);
        this.showModal = false;
      },
      error: ()=>{
        this.loading.hide();
      }
    })
  }

  modalAssignmentPolicy(id:number) {
    this.showModal = true
    this.ticketId = id;
    this.selectedUser = null
  }

  navigateToSepidbal(){
    window.open('https://sbpn.ir/complaint', '_blank');
  }

}

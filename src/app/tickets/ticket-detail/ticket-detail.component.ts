import {Component, OnInit} from '@angular/core';
import {TicketsService} from "../tickets.service";
import {LoadingService} from "../../_services/loading.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CommonModule, Location, NgFor, NgIf} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {PanelModule} from "primeng/panel";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {IActiveDate, NgPersianDatepickerModule} from "ng-persian-datepicker";
import {EditorModule} from "primeng/editor";
import {ActivityType} from "../../setting/_types/activity.type";
import {UserTypeBase} from "../../setting/_types/user.type";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WorkItemService} from "../../work-item/work-item.service";
import {CustomMessageService} from "../../_services/custom-message.service";
import {KeyFilterModule} from "primeng/keyfilter";
import {ActivityWorkItemType} from "../../work-item/_types/activity-workItem.type";
import {DomSanitizer} from "@angular/platform-browser";
import {DialogModule} from "primeng/dialog";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {TicketBaseType, CustomerFeelsEnum2LabelMapping} from "../_types/ticket-base.type";
import {TableModule} from "primeng/table";
import {ActivityNoteComponent} from "../../_components/activity-note/activity-note.component";
import {TooltipModule} from "primeng/tooltip";
import moment from "jalali-moment";
import {TicketTypeEnum, TicketTypeEnum2LabelMapping} from "../../_enums/ticket-type.enum";
import {Utilities} from "../../_classes/utilities";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {ServerTimeService} from "../../_services/server-time.service";
import {ChangeLogType} from "../../_types/change-log.type";
import {WorkItemChangeLogTypesEnum2LableMapping} from "../../_enums/workItem-change-log-types.enum";
import {DividerModule} from "primeng/divider";

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    ButtonModule,
    PanelModule,
    AutoCompleteModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    NgPersianDatepickerModule,
    EditorModule,
    FormsModule,
    KeyFilterModule,
    ReactiveFormsModule,
    DialogModule,
    JalaliDatePipe,
    TableModule,
    ActivityNoteComponent,
    TooltipModule,
    RouterLink,
    OverlayPanelModule,
    DividerModule
  ],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.scss',
  providers: [JalaliDatePipe]
})
export class TicketDetailComponent implements OnInit{

  ticketId:string;
  ticketInfo: TicketBaseType;
  ticketPastBills= [];
  isHovered = false;
  showModalPastBills:boolean = false;

  protected readonly TicketTypeEnum2LabelMapping = TicketTypeEnum2LabelMapping
  protected readonly CustomerFeelsEnum2LabelMapping = CustomerFeelsEnum2LabelMapping;

  colors = [
    'bg-green-100 text-green-600',
    'bg-blue-100 text-blue-600',
    'bg-yellow-100 text-yellow-600',
    'bg-purple-100 text-purple-600',
    'bg-pink-100 text-pink-600',
    'bg-orange-100 text-orange-600',
    'bg-cyan-100 text-cyan-600',
    'bg-teal-100 text-teal-600',
    'bg-indigo-100 text-indigo-600',
    'bg-red-100 text-red-600'
  ];

  constructor(private service:TicketsService,
              private workItemService: WorkItemService,
              private serverTimeService: ServerTimeService,
              private messagesService: CustomMessageService,
              private loading: LoadingService,
              private ativatedRoute: ActivatedRoute,
              private jalaliPipe: JalaliDatePipe,
              private router: Router,
              private location: Location,) {
    this.ativatedRoute.params.subscribe((res) =>{
      if (res['ticketDetailId']){
        this.ticketId = res['ticketDetailId']
      }
    })
  }

  ngOnInit() {
    this.getInfoTicket();
  }

  getInfoTicket(){
    this.loading.show()
    this.service.getDetailTicket(this.ticketId).subscribe((ticket) => {
      this.loading.hide()
      this.ticketInfo = ticket
      // this.ticketPastBills = ticket.pastBills
    }, error => {
      this.loading.hide()
    });
  }

  closeTicket(){
    this.loading.show();
    this.service.onCloseTicket(this.ticketId).subscribe(res => {
      this.loading.hide();
      this.getInfoTicket();
    }, error => {
      this.loading.hide();
    })
  }

  calculateDaysDifference(inputDate: string | null){
    if (!inputDate) {
      console.warn("تاریخ ورودی معتبر نیست.");
      return 0;
    }
    const formattedDate = this.jalaliPipe.transform(inputDate, 'date');
    const today = this.jalaliPipe.transform(new Date(), 'date');

    const givenDate = moment(formattedDate, 'YYYY/MM/DD').locale('fa');
    const todayDate = moment(today, 'YYYY/MM/DD').locale('fa');

    return todayDate.diff(givenDate, 'days') + ' روز گذشته '
  }

  calculateTicketDeadline(inputDate: string | null): string {
    if (!inputDate) {
      console.warn("تاریخ ورودی معتبر نیست.");
      return '0 روز باقی مانده';
    }
    const serverTimeStr  = this.serverTimeService.getServerTime();
    const target = moment(inputDate);
    const now = moment(serverTimeStr.replace(' ', 'T'));

    const duration = moment.duration(target.diff(now));

    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();

    if (duration.asMilliseconds() <= 0) {
      return `${Math.abs(days)} روز ${Math.abs(hours)} ساعت ${Math.abs(minutes)} دقیقه گذشته`;
    }

    return `${days} روز ${hours} ساعت ${minutes} دقیقه باقی مانده`;
  }

  backLocation(){
    this.location.back();
  }

}

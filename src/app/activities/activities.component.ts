import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {Table, TableLazyLoadEvent, TableModule} from "primeng/table";
import {ButtonGroupModule} from "primeng/buttongroup";
import {ActivitiesService} from "./activities.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LoadingService} from "../_services/loading.service";
import {DropdownModule} from "primeng/dropdown";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {DividerModule} from "primeng/divider";
import {WorkItemService} from "../work-item/work-item.service";
import {ActivityType} from "../setting/_types/activity.type";
import {UserTypeBase} from "../setting/_types/user.type";
import {IActiveDate, NgPersianDatepickerModule} from "ng-persian-datepicker";
import moment from 'jalali-moment';
import {ActivitiesType} from "./type/activities.type";
import {JalaliDatePipe} from "../_pipes/jalali.date.pipe";
import {CustomMessageService} from "../_services/custom-message.service";
import {DialogModule} from "primeng/dialog";
import {CreateActivityType, TimePeriod} from "../_types/create-activity.type";
import {CustomerSpecification, WorkItemType} from "../path/_types/create-work-item.type";
import {AutoCompleteModule} from "primeng/autocomplete";
import {UploadFileComponent} from "../_components/upload-file/upload-file.component";
import {KeyFilterModule} from "primeng/keyfilter";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {Utilities} from "../_classes/utilities";
import {TimeUnitsEnum, TimeUnitsEnum2LabelMapping} from "../_enums/TimeUnits.enum";
import {TooltipModule} from "primeng/tooltip";
import {take} from "rxjs/operators";
import {AuthenticationService} from "../_services/authentication.service";
import {LoginOutputSscrmType} from "../_types/login-output.type";
import {UserTypesEnum} from "../_enums/user-types.enum";
import {ServerTimeService} from "../_services/server-time.service";
import {FileUploadModule} from "primeng/fileupload";
import {NewActivityModalComponent} from "../_components/new-activity-modal/new-activity-modal.component";
import {ConfirmationService, MessageService} from "primeng/api";
import {ActivityNoteService} from "../_components/activity-note/activity-note.service";
import {IStructureData} from "../work-item/_types/activity-workItem.type";
import {BadgeModule} from "primeng/badge";
import {TabViewChangeEvent, TabViewModule} from "primeng/tabview";

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ButtonGroupModule,
    TableModule,
    RouterLink,
    DropdownModule,
    OverlayPanelModule,
    DividerModule,
    NgPersianDatepickerModule,
    JalaliDatePipe,
    DialogModule,
    AutoCompleteModule,
    FileUploadModule,
    UploadFileComponent,
    KeyFilterModule,
    InputTextModule,
    InputTextareaModule,
    TooltipModule,
    NewActivityModalComponent,
    BadgeModule,
    TabViewModule
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent implements OnInit, AfterViewInit{

  startDateActivity!: string;
  startDate!: string;
  finishDate!: string;
  startDateActivityTimeControl = new FormControl()
  startDateTimeControl = new FormControl()
  finishDateTimeControl = new FormControl()
  hourTime = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','21','23',];
  minuteTime = ['00','05','10','15','20','25','30','35','40','45','50','55'];
  selectedHourTime: string;
  selectedMinuteTime: string;

  selectedIndex: number | null = null;
  selectedDate: string = 'all';
  selectedUser?:any;
  responsible: any;
  responsibleId: any;
  activeItem: number[] = [];

  activityList: ActivityType[]=[];
  many:ActivitiesType[] = []
  userList: UserTypeBase[]=[];
  selectedExpert: number|null = null;
  filterType: number | null = null;
  showDoneActivityModal:boolean = false;
  showResultActivityModal:boolean = false;
  showModalNewActivity:boolean = false;
  modalState:string = 'new';
  newActivity : CreateActivityType = new CreateActivityType({})
  resultActivity?:string;
  showResult:string;
  seletedActivityId?: number;

  filteredCustomer: CustomerSpecification[];
  filteredWorkItem: WorkItemType[];
  workItemTitle: any;
  companyName: any;

  urlFile = []
  reminders: TimePeriod[] = [];
  TimeUnits:any

  user:LoginOutputSscrmType|undefined = undefined;
  @ViewChild('uploadFileComponent') uploadFileComponent!: UploadFileComponent;
  @ViewChild('newActivityModal') newActivityModal!: NewActivityModalComponent;
  protected readonly UserTypesEnum = UserTypesEnum

  doneDateActivitesCount: number = 0;
  notArrivedActivitesCount:number = 0;
  overDuedActivitesCount:number = 0;
  totalActivitesCount:number = 0
  totalRecords: number | undefined = 0;
  listOfActivity:IStructureData<ActivitiesType>;
  constructor(
    private activityService: ActivitiesService,
    private activeNoteervice: ActivityNoteService,
    private workItemService: WorkItemService,
    private serverTimeService: ServerTimeService,
    private customMessageService: CustomMessageService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private loading: LoadingService,
    private cdRef : ChangeDetectorRef,
    private authService:AuthenticationService,
  ) {
    // super(activityService,confirmationService,messageService);
    this.TimeUnits = Utilities.ConvertEnumToKeyPairArray(TimeUnitsEnum,TimeUnitsEnum2LabelMapping)
    authService.token?.pipe(take(1)).subscribe(token => {
      this.user = token
    });

  }

  ngOnInit() {
    this.paginationData.from = 0;
    this.paginationData.hasMore = true;
    this.getListOfActivity()
    this.getListOfUsers();
    this.reminders = [new TimePeriod()];
  }

  ngAfterViewInit() {}


  tabs = [
    { key: 'all', title: 'همه فعالیت‌ها', loader:() => this.setFilterType(null) },
    { key: 'done', title: 'انجام شده', loader:() => this.setFilterType(0) },
    { key: 'notArrived', title: 'فرا نرسیده', loader:() => this.setFilterType(1) },
    { key: 'overdue', title: 'معوق شده', loader:() => this.setFilterType(2) }
  ];







  // paginationData = { from: 0, rows: 20, startDate:null, finishDate:null, activityTypeIds:[]};
  paginationData = { from: 0, rows: 20, isLoading: false, hasMore: true, startDate: null, finishDate: null, activityTypeIds: [] };
  getListOfActivites(){
    if (this.paginationData.isLoading || !this.paginationData.hasMore) return;

    const input = {
      from: this.paginationData.from,
      rows: this.paginationData.rows,
      startDate: this.startDate ? this.startDate?.trim()?.concat('T' + '00:00:00') : null,
      finishDate: this.finishDate ? this.finishDate?.trim()?.concat('T' + '23:59:59') : null,
      activityTypeIds: this.getSelectedActivityTypeIds(),
      doneState: this.filterType,
      userId: this.selectedUser
    };

    this.loading.show()
    this.paginationData.isLoading = true;
    this.activityService.getActivities(input).subscribe((res) =>{
      this.loading.hide();
      this.paginationData.isLoading = false;

      const serverTimeStr  = this.serverTimeService.getServerTime();

      this.listOfActivity = res

      if (this.listOfActivity?.items?.length < this.paginationData.rows) {
        this.paginationData.hasMore = false;
      }

      if (serverTimeStr ){
        const serverTime = new Date(serverTimeStr.replace(' ', 'T'));

        const mapped = this.listOfActivity?.items?.map((item: any) => {
          const due = new Date(item.dueDate);
          return {
            ...item,
            isExpired: serverTime > due
          };
        });

        this.many.push(...mapped); // الحاق به لیست فعلی
        this.paginationData.from += this.paginationData.rows;

      }

    }, error => {
      this.loading.hide();
      this.paginationData.isLoading = false;
    })
  }

  onScroll(event: any) {
    const element = event.target;

    if (
      !this.paginationData.isLoading &&
      this.paginationData.hasMore &&
      element.scrollHeight - element.scrollTop <= element.clientHeight + 100
    ) {
      // this.paginationData.from = 0;
      // this.paginationData.hasMore = true;
      // this.many = [];
      this.getListOfActivites();
    }
  }

  // حذف فعالیت
  deleteItemActiviy(id :number){
    this.confirmationService.confirm({
      header: 'حذف',
      message: 'آیا از انجام حذف اطمینان دارید؟',

      accept: () => {
        this.activeNoteervice.deleteActivity(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'موفق',
              detail: 'حذف با موفقیت انجام شد.',
            });
            this.paginationData.from = 0;
            this.paginationData.hasMore = true;
            this.many = [];
            this.getListOfActivites()
          },
          error: () => {
            // this.messageService.add({
            //     severity: 'error',
            //     summary: 'خطا',
            //     detail: 'حذف با خطا مواجه  شد',
            // });
          },
        });
      },
    });
  }


  getListOfActivity(){
    this.loading.show();
    this.workItemService.getActivityTypes().subscribe((res) =>{
      this.loading.hide();
      this.activityList = res;
      this.activeItem = this.activityList.map((_, index) => index);
      this.paginationData.from = 0;
      this.paginationData.hasMore = true;
      this.many = [];
      this.getListOfActivites();
    }, error => {
      this.loading.hide();
    })
  }

  getSelectedActivityTypeIds(): number[] {
    if (!this.activityList?.length) return [];
    return this.activeItem.map(i => this.activityList[i].id);
  }


  getListOfUsers(){
    this.loading.show();
    this.workItemService.getListOfUsers().subscribe((res) =>{
      this.loading.hide();
      this.userList = res;
    }, error => {
      this.loading.hide();
    })
  }

  setFilterType(type: number | null) {
    this.filterType = type;
    this.paginationData.from = 0;
    this.paginationData.hasMore = true;
    this.many = [];
    this.getListOfActivites()
  }

  allDate(){
    this.selectedDate = 'all'
    this.startDate = null;
    this.finishDate = null;
    this.startDateTimeControl.setValue(null);
    this.finishDateTimeControl.setValue(null);
    this.paginationData.from = 0;
    this.paginationData.hasMore = true;
    this.many = [];
    this.getListOfActivites()
  }

  pastDate(){
    this.selectedDate = 'pastDate'
    const today = moment().startOf('day');
    const formatted = today.format('YYYY-MM-DD');
    this.startDate = null;
    this.finishDate = formatted
    this.paginationData.from = 0;
    this.paginationData.hasMore = true;
    this.many = [];
    this.getListOfActivites()
    // this.startDateTimeControl.setValue(null);
    // this.finishDateTimeControl.setValue(formatted);
  }

  setToday() {
    this.selectedDate = 'today'
    const today = moment().startOf('day');
    const startDay = today.format('YYYY-MM-DD');
    const endDay = today.format('YYYY-MM-DD');
    this.startDate = startDay;
    this.finishDate = endDay;
    this.paginationData.from = 0;
    this.paginationData.hasMore = true;
    this.many = [];
    this.getListOfActivites()
    // this.startDateTimeControl.setValue(formatted);
    // this.finishDateTimeControl.setValue(formatted);
    // console.log(this.startDateTimeControl.value)
    // console.log(this.finishDateTimeControl.value)
  }

  // فردا
  setTomorrow() {
    this.selectedDate = 'tomorrow'
    const tomorrow = moment().add(1, 'day').startOf('day');
    const startDay = tomorrow.format('YYYY-MM-DD');
    const endDay = tomorrow.format('YYYY-MM-DD');
    this.startDate = startDay;
    this.finishDate = endDay;
    this.paginationData.from = 0;
    this.paginationData.hasMore = true;
    this.many = [];
    this.getListOfActivites()
    // this.startDateTimeControl.setValue(formatted);
    // this.finishDateTimeControl.setValue(formatted);
    // console.log(this.startDateTimeControl.value)
    // console.log(this.finishDateTimeControl.value)
  }

  // تا آخر هفته (شنبه تا جمعه)
  setUntilEndOfWeek() {

    this.selectedDate = 'untilWeekend'
    const todayJalali = moment().locale('fa').startOf('day');
    // مرحله 2: استخراج شماره روز هفته (0=شنبه ... 6=جمعه)
    const todayIndex = todayJalali.day();
    // مرحله 3: محاسبه تاریخ جمعه همین هفته
    let nextFridayJalali = todayJalali.clone().add(6 - todayIndex, 'day'); // جمعه همین هفته
    // مرحله 4: اگر امروز جمعه است (یعنی day = 6)، تاریخ جمعه هفته بعد را محاسبه کنیم
    if (todayIndex === 6) {
      nextFridayJalali = todayJalali.clone().add(6, 'day'); // جمعه هفته بعد
    }
    // مرحله 4: نمایش تاریخ‌ها به صورت میلادی
    const startDate = todayJalali.clone().locale('en').format('YYYY-MM-DD');
    const endDate = nextFridayJalali.clone().locale('en').format('YYYY-MM-DD');

    this.startDate = startDate;
    this.finishDate = endDate
    this.paginationData.from = 0;
    this.paginationData.hasMore = true;
    this.many = [];
    this.getListOfActivites()

  }

  // هفته آینده (شنبه تا جمعه هفته بعد)
  setNextWeek() {
    this.selectedDate = 'nextWeek'
    const today = moment().locale('fa').startOf('day');

    // قدم اول: شنبه هفته جاری (با استفاده از startOf)
    const currentWeekSaturday = today.clone().startOf('week'); // شنبه همین هفته

    // قدم دوم: شنبه هفته آینده = شنبه این هفته + 7 روز
    const nextWeekSaturday = currentWeekSaturday.clone().add(7, 'day');
    const nextWeekFriday = nextWeekSaturday.clone().add(6, 'day');

    // خروجی با فرمت میلادی
    const startDate = nextWeekSaturday.clone().locale('en').format('YYYY-MM-DD');
    const endDate = nextWeekFriday.clone().locale('en').format('YYYY-MM-DD');
    this.startDate = startDate;
    this.finishDate = endDate
    this.paginationData.from = 0;
    this.paginationData.hasMore = true;
    this.many = [];
    this.getListOfActivites()
    // this.startDateTimeControl.setValue(startDate);
    // this.finishDateTimeControl.setValue(endDate);
    // console.log(this.startDate)
    // console.log(this.finishDate)
  }

  otherDate(){
    this.startDate.trim()?.concat('T' + '00:00:00'),
      this.finishDate.trim()?.concat('T' + '23:59:59')
    this.paginationData.from = 0;
    this.paginationData.hasMore = true;
    this.many = [];
    this.getListOfActivites()
  }

  // ثبت فعالیت انجام شده
  onDoneActivity(){
    this.loading.show()
    const input = {
      id: this.seletedActivityId,
      result: this.resultActivity
    }
    this.activityService.onDoneActivity(input).subscribe((res) =>{
      this.loading.hide()
      this.customMessageService.showSuccess('عملیات با موفقیت انجام شد.')
      this.showDoneActivityModal = false;
      this.paginationData.from = 0;
      this.paginationData.hasMore = true;
      this.many = [];
      this.getListOfActivites()
    }, error => {
      this.loading.hide()
    })
  }

  // افزودن فعالیت جدید
  onRegisterActivity(mode:string) {
    if (this.newActivity.title === undefined || this.newActivity.title == null){
      return this.customMessageService.showError('عنوان فعالیت اجباری می باشد.')
    }
    if (this.newActivity.userId === undefined || this.newActivity.userId == null){
      return this.customMessageService.showError('مسئول انجام فعالیت اجباری می باشد.')
    }

    if (this.selectedIndex !== null && this.activityList[this.selectedIndex]) {
      this.newActivity.iconClass = this.activityList[this.selectedIndex].iconClass ?? ''
    } else {this.newActivity.iconClass = ''}

    if (this.user.userType === UserTypesEnum.Expert){
      this.newActivity.userId = this.user.id
    }

    if (this.shouldShowReminderFields()) {
      this.newActivity.reminders = this.reminders;
    } else {
      this.newActivity.reminders = [];
    }

    this.newActivity.dueDate = this.startDateActivity ? this.startDateActivity.trim()?.concat('T' + `${this.selectedHourTime ? this.selectedHourTime : '00' }:${this.selectedMinuteTime ? this.selectedMinuteTime + ':00' : '00:00'}`) : null;
    this.newActivity.workItemId = null
    this.newActivity.customerId = null

    this.newActivity.attachments = this.urlFile
    this.newActivity.customerId = this.companyName.id
    this.newActivity.workItemId = this.workItemTitle.id
    this.loading.show()
    this.workItemService.onCreateUpdateNewActivity(this.newActivity,mode).subscribe((res) =>{
      this.loading.hide();
      this.showModalNewActivity = false
      this.customMessageService.showSuccess('عملیات با موفقیت ثبت شد.')
      this.paginationData.from = 0;
      this.paginationData.hasMore = true;
      this.many = [];
      this.getListOfActivites()
    }, error => {
      this.loading.hide();
    })
  }

  callListOfActivity(item:any){
    this.paginationData.from = 0;
    this.paginationData.hasMore = true;
    this.many = [];
    this.getListOfActivites()
  }

  setActive(index: number) {
    const itemIndex = this.activeItem.indexOf(index);
    if (itemIndex > -1) {
      // If the item is already selected, remove it
      this.activeItem.splice(itemIndex, 1);
    } else {
      // If the item is not selected, add it
      this.activeItem.push(index);
    }
    this.paginationData.from = 0;
    this.paginationData.hasMore = true;
    this.many = [];
    this.getListOfActivites();
  }


  isReminderDisabled:boolean;
  // محاسبه تاریخ و زمان فعلی جلوتر از تاریخ و زمان انتخاب شده
  shouldShowReminderFields(): boolean {
    if (!this.startDateActivity || !this.selectedHourTime || !this.selectedMinuteTime) {
      return false;
    }

    const selectedDate = new Date(this.startDateActivity);
    selectedDate.setHours(+this.selectedHourTime);
    selectedDate.setMinutes(+this.selectedMinuteTime);
    selectedDate.setSeconds(0);

    const now = new Date();
    this.isReminderDisabled = selectedDate.getTime() <= now.getTime();

    // اگر قبلاً حذفشون کرده بودی، دیگه نکن
    if (!this.isReminderDisabled && this.reminders.length === 0) {
      this.reminders = [new TimePeriod()];
    }

    return true; // همیشه نمایش بده
  }

//************************************************ start Date functions ***************************************
  initialStartDatePicker(event: IActiveDate) {
    // this.startDate = event.gregorian;
  }
  selectStartDate(event: IActiveDate) {
    this.startDate = event.gregorian
  }

  initialFinishDatePicker(event: IActiveDate) {
    // this.finishDate = event.gregorian
  }
  selectFinishDate(event: IActiveDate) {
    this.finishDate = event.gregorian
  }

  initialStartDatePickerActivity(event: IActiveDate) {
    this.startDateActivity = event.gregorian;
  }
  selectStartDateActivity(event: IActiveDate) {
    this.startDateActivity = event.gregorian
  }
  //************************************************ end Date functions ***************************************


  doneActivityModal(id:any) {
    this.seletedActivityId = id
    this.showDoneActivityModal = true
    this.resultActivity = null;
  }

  addNewActivity(mode:string) {
    this.showModalNewActivity = true;
    this.modalState = mode;
    this.newActivityModal.open(this.modalState)

    // this.newActivity = new CreateActivityType({});
    // this.reminders = [new TimePeriod()];
    // this.selectedMinuteTime = null;
    // this.selectedHourTime = null;
    // this.uploadFileComponent.reset()

    // if (this.activityList.length > 0) {
    //   const firstItem = this.activityList[0];
    //   this.selectedIndex = 0;
    //   this.newActivity.activityTypeId = firstItem.id;
    //   this.newActivity.title = firstItem.title;
    //   this.newActivity.duration = firstItem.defaultDuration;
    // } else {
    //   this.selectedIndex = null;
    // }

  }

  onClickEditActivity(id:number){
    this.newActivityModal.onShowModalEditActivity(id);
  }

  onClickHistoryActivity(id:number){
    this.newActivityModal.onShowModalEditActivity(id);
  }

  onResultActivity(item:any){
    this.showResultActivityModal = true;
    this.showResult= item.result;

  }

  changeMainPhoto(event:any) {
    // if (!event || event.length === 0) {
    //   console.warn("فایل معتبر دریافت نشد.");
    //   return;
    // }

    // this.urlFile = event[0];
    this.urlFile = event;
    // console.log(this.urlFile);
    // console.log(event)

    // اجرای دستی Change Detection
    this.cdRef.detectChanges()
  }

  filterCustomer(event: any) {
    this.workItemService.getSearchCustomer(event.query).subscribe(res => {
      this.filteredCustomer = res.map(customer =>({
        ...customer,
        fullName: `${customer.name} ${customer.family}`
      })) as CustomerSpecification[];
    })
  }

  filterWorkItems(event: any){
    this.workItemService.getSearchWorkItems(event.query,this.newActivity.customerId).subscribe((res) =>{
      this.filteredWorkItem = res
    })
  }

  selectedSearchCustomer(filter: any){
    this.newActivity.customerId = filter.value.id
  }

  selectedSearchWorkItems(filter:any){
    this.newActivity.workItemId = filter.value.id
  }

  // با انتخاب آیکون مورد نظر عنوان و مدت انجام فعالیت مقدار خواهد گرفت
  onSetValue(item:any,index: number): void {
    if (this.selectedIndex === index) {
      this.selectedIndex = null;
      this.newActivity.title = '';
      this.newActivity.duration = 0;
      this.newActivity.activityTypeId = null
    } else {
      this.selectedIndex = index;
      this.newActivity.title = item.title;
      this.newActivity.duration = item.defaultDuration;
      this.newActivity.activityTypeId = item.id
    }
  }

  closePanel() {
    this.showModalNewActivity = false;
  }

  addReminder() {
    this.reminders.push(new TimePeriod());
  }

  deleteReminder(index: number) {
    this.reminders.splice(index, 1);
  }

  changeExpertUser() {
    this.paginationData.from = 0;
    this.paginationData.hasMore = true;
    this.many = [];
    this.getListOfActivites()
  }

  selectExpert(expert: any, index:number) {
    this.selectedUser = expert.id;
    if (this.selectedExpert === index) {
      this.selectedExpert = null;
      this.selectedUser = null;
    } else {
      this.selectedExpert = index;
    }
    this.changeExpertUser();
  }


  getLink(object: any): any[] | null {
    if (object?.workItem) {
      return ['/workItem', object.workItem.id];
    } else if (object?.customer) {
      return ['/setting/customers/edit', object.customer.id];
    }

    return null;
  }


  activeTabIndex = 0
  onTabChanged(event: TabViewChangeEvent) {
    this.activeTabIndex = event.index;
    const tab = this.tabs[event.index];
    if (tab && tab.loader){
      tab.loader()
    }
  }
}

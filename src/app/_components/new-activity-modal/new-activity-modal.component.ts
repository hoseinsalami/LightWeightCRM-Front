import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivityType} from "../../setting/_types/activity.type";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserTypeBase} from "../../setting/_types/user.type";
import {CustomerSpecification, WorkItemType} from "../../path/_types/create-work-item.type";
import {CommonModule} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {NgPersianDatepickerModule} from "ng-persian-datepicker";
import {KeyFilterModule} from "primeng/keyfilter";
import {AutoCompleteModule} from "primeng/autocomplete";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DialogModule} from "primeng/dialog";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {FileUploadModule} from "primeng/fileupload";
import {UploadFileComponent} from "../upload-file/upload-file.component";
import {TooltipModule} from "primeng/tooltip";
import {CreateActivityType, TimePeriod} from "../../_types/create-activity.type";
import {WorkItemService} from "../../work-item/work-item.service";
import {CustomMessageService} from "../../_services/custom-message.service";
import {LoadingService} from "../../_services/loading.service";
import {LoginOutputSscrmType} from "../../_types/login-output.type";
import {UserTypesEnum} from "../../_enums/user-types.enum";
import {ActivityWorkItemType} from "../../work-item/_types/activity-workItem.type";
import {Utilities} from "../../_classes/utilities";
import {TimeUnitsEnum, TimeUnitsEnum2LabelMapping} from "../../_enums/TimeUnits.enum";
import {take} from "rxjs/operators";
import {AuthenticationService} from "../../_services/authentication.service";
import moment from "jalali-moment";
import {ActivityNoteService} from "../activity-note/activity-note.service";
import {MultiSelectModule} from "primeng/multiselect";

@Component({
  selector: 'app-new-activity-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    NgPersianDatepickerModule,
    ReactiveFormsModule,
    KeyFilterModule,
    AutoCompleteModule,
    InputTextareaModule,
    DialogModule,
    JalaliDatePipe,
    FileUploadModule,
    UploadFileComponent,
    TooltipModule,
    MultiSelectModule
  ],
  templateUrl: './new-activity-modal.component.html',
  styleUrl: './new-activity-modal.component.css',
  providers: [JalaliDatePipe]
})
export class NewActivityModalComponent implements OnInit{

  @ViewChild('uploadFileComponent') uploadFileComponent!: UploadFileComponent;
  @Input('activityList') activityList: ActivityType[];
  @Input('userList') userList: UserTypeBase[]=[];
  @Input() workItemId?: string;
  @Input() expertId?: number;
  @Input() customerId?: string;
  @Input() isDisabled?: boolean = true;
  @Output() activityRegistered = new EventEmitter<any>();
  isDisabledExpert:boolean = false;

  showModalNewActivity:boolean = false;
  modalState:string = 'new' || 'edit' || 'history';
  selectedIndex: number | null = null;

  startDate!: string;
  startDateTimeControl = new FormControl();

  hourTime = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','21','23',];
  minuteTime = ['00','05','10','15','20','25','30','35','40','45','50','55'];
  selectedHourTime: string = undefined;
  selectedMinuteTime: string;


  filteredCustomer: CustomerSpecification[];
  filteredWorkItem: WorkItemType[];
  newActivity : CreateActivityType = new CreateActivityType({})
  reminders: TimePeriod[] = [];
  urlFile = []
  activityData:ActivityWorkItemType[] = [];
  doneActivities = [];
  undoneActivities = [];
  activityPageInfo = { from: 0, rows: 20, isLoading: false, hasMore: true };

  workItem: WorkItemType;
  companyName: CustomerSpecification;
  expertUsers: UserTypeBase[];
  selectedExpert:UserTypeBase
  selectedExpertId:number;

  isCollapsed: boolean = true;
  user:LoginOutputSscrmType|undefined = undefined;
  protected readonly UserTypesEnum = UserTypesEnum
  TimeUnits:any



  constructor(private workItemService: WorkItemService,
              private messagesService: CustomMessageService,
              private loading: LoadingService,
              private authService:AuthenticationService,
              private activeNoteervice: ActivityNoteService,
              private jalaliPipe: JalaliDatePipe) {
    this.TimeUnits = Utilities.ConvertEnumToKeyPairArray(TimeUnitsEnum,TimeUnitsEnum2LabelMapping);
    authService.token?.pipe(take(1)).subscribe(token => {
      this.user = token
    });
  }

  ngOnInit() {
    this.getListOfActivity();

    this.activeNoteervice.openActivityModal$.subscribe(({ id }) => {
      this.onShowModalEditActivity(id);
    });

  }

  get filteredRelatedUsers(): UserTypeBase[] {
    if (!this.newActivity.userId) {
      return this.userList;
    }
    // حذف کاربری که در dropdown اول انتخاب شده
    return this.userList.filter(u => u.id !== this.newActivity.userId);
  }

  // لیست نوع فعالیت ها
  getListOfActivity(){
    this.loading.show();
    this.workItemService.getActivityTypes().subscribe((res) =>{
      this.loading.hide();
      this.activityList = res;
      if (this.activityList.length > 0){
        this.selectedIndex = 0
        this.newActivity.activityTypeId = this.activityList[0].id
        this.newActivity.title = this.activityList[0].title
        this.newActivity.duration = this.activityList[0].defaultDuration
      }
      // this.cdRef.detectChanges();
    }, error => {
      this.loading.hide();
    })
  }

  // با انتخاب آیکون مورد نظر عنوان و مدت انجام فعالیت مقدار خواهد گرفت
  onSetValue(item:any,index: number): void {
    if (this.selectedIndex !== index) {
      this.selectedIndex = index;
      this.newActivity.title = item.title;
      this.newActivity.duration = item.defaultDuration;
      this.newActivity.activityTypeId = item.id
    }
  }

  // **************** start Date Picker ****************
  initialStartDatePicker(event: any) {
    this.startDate = event.gregorian;
  }
    selectStartDate(event: any) {
    this.startDate = event.gregorian
  }

  // setTodayDate() {
  //   const todayJalali = moment().format('jYYYY-jMM-jDD'); // مثلاً: 1403-03-25
  //   const todayGregorian = moment().format('YYYY-MM-DD'); // برای کنترل
  //
  //   this.startDateTimeControl.setValue(todayJalali); // مقداردهی به فرم‌کنترل
  //   this.startDate = todayJalali;
  // }
  // **************** end Date Picker ****************


  isReminderDisabled:boolean;
  // محاسبه تاریخ و زمان فعلی جلوتر از تاریخ و زمان انتخاب شده
  shouldShowReminderFields(): boolean {
    if (!this.startDate || !this.selectedHourTime || !this.selectedMinuteTime) {
      return false;
    }

    const selectedDate = new Date(this.startDate);
    selectedDate.setHours(+this.selectedHourTime);
    selectedDate.setMinutes(+this.selectedMinuteTime);
    selectedDate.setSeconds(0);

    const now = new Date();
    this.isReminderDisabled = selectedDate.getTime() <= now.getTime();

    // اگر قبلاً حذفشون کرده بودی، دیگه نکن
    // if (!this.isReminderDisabled && this.reminders.length === 0) {
    //   this.reminders = [new TimePeriod()];
    // }

    return true; // همیشه نمایش بده

  }

  filterCustomer(event: any) {
    this.workItemService.getSearchCustomer(event.query).subscribe(res => {
      this.filteredCustomer = res.map(customer =>({
        ...customer,
        fullName: `${customer.name} ${customer.family} (${customer.companyName})`
      })) as CustomerSpecification[];
    })
  }

  selectedSearchCustomer(filter: any){
    this.newActivity.customerId = filter.value.id;
    this.workItem = null;
    this.newActivity.workItemId = null;
  }


  filterWorkItems(event: any) {
    this.workItemService.getSearchWorkItems(event.query, this.newActivity.customerId).subscribe((res) => {
      this.filteredWorkItem = res
    })
  }

  selectedSearchWorkItems(filter:any){
    this.newActivity.workItemId = filter.value.id
  }

  // افزودن فعالیت جدید
  onRegisterActivity(mode:string) {
    if (this.newActivity.title === undefined || this.newActivity.title == null){
      return this.messagesService.showError('عنوان فعالیت اجباری می باشد.')
    }

    this.newActivity.userId = this.newActivity.userId ? this.newActivity.userId : null

    // if (
    //       (this.user.userType === this.UserTypesEnum.Admin || this.user.userType === this.UserTypesEnum.SuperAdmin)
    //       &&
    //       (this.newActivity.userId === undefined || this.newActivity.userId == null)
    //   )
    // {
    //   // this.newActivity.userId = this.expertId
    //   return this.messagesService.showError('مسئول انجام فعالیت اجباری می باشد.')
    // }
    // else {
      // اگه کارشناس بود
      // this.newActivity.userId == null

    if (this.selectedIndex !== null && this.activityList[this.selectedIndex]) {
      this.newActivity.iconClass = this.activityList[this.selectedIndex].iconClass ?? ''
    } else { this.newActivity.iconClass = '' }


    if (this.workItemId){
      this.newActivity.workItemId = +this.workItemId
    }

    if (this.customerId) {
      this.newActivity.customerId = +this.customerId
    }

    this.newActivity.relatedUsersIds = this.newActivity?.relatedUsersIds ?? [];

    if (this.shouldShowReminderFields()) {
      const validReminders = this.reminders.filter(r =>
        r.value !== undefined && r.value !== null &&
        r.periodTimeUnit !== undefined && r.periodTimeUnit !== null
      );
      this.newActivity.reminders = validReminders;
    } else {
      this.newActivity.reminders = [];
    }

    this.newActivity.dueDate = this.startDate ? this.startDate.trim()?.concat('T' + `${this.selectedHourTime ? this.selectedHourTime : '00' }:${this.selectedMinuteTime ? this.selectedMinuteTime + ':00' : '00:00'}`) : null;

    // آپلود فایل ها در حالت ویرایش و جدید
    if (this.modalState === 'edit') {
      const finalFileList = this.urlFile;

      // فقط فایل‌هایی که هنوز وجود دارند (یعنی حذف نشدن)، نگه می‌داریم
      const existingOldFiles = this.newActivity.attachments?.filter(oldFile => {
        return finalFileList.some(current => current.id === oldFile.id);
      }) ?? [];

      // فقط فایل‌هایی که id ندارند (جدید هستند) جدا می‌کنیم
      const newFiles = finalFileList.filter(f => !f.id);

      // ادغام فایل‌های موجود و جدیدها
      this.newActivity.attachments = [...existingOldFiles, ...newFiles];
    } else {
      this.newActivity.attachments = this.urlFile;
    }

    console.log(this.newActivity)
    this.loading.show();
    this.workItemService.onCreateUpdateNewActivity(this.newActivity,mode).subscribe((res) =>{
      this.loading.hide();
      this.isCollapsed = true;

      this.activityData = [];
      this.doneActivities = [];
      this.undoneActivities = [];
      this.activityPageInfo = { from: 0, rows: 20, isLoading: false, hasMore: true };
      this.activityRegistered.emit('activities')
      this.showModalNewActivity = false
      this.messagesService.showSuccess('عملیات با موفقیت ثبت شد.')
    }, error => {
      this.loading.hide();
    })
  }

  // گرفتن اطلاعات یک فعالیت برای ویرایش
  onShowModalEditActivity(id:number) {
    this.loading.show();
    // this.modalState = mode

    this.activeNoteervice.getActivityById(id).subscribe(res =>{
      this.loading.hide()
      this.newActivity = res

      this.modalState = this.newActivity?.doneDate ? 'history' : this.newActivity.id ? 'edit' : 'new'

      this.reminders = this.newActivity.reminders ?? [];
      this.urlFile = this.newActivity.attachments ?? [];
      this.workItem = this.newActivity.workItem;
      this.companyName = this.newActivity.customer;
      this.startDateTimeControl.patchValue(moment(res.dueDate).locale('fa').format('YYYY-MM-DD').toString());

      // خروجی مثل همون جدول
      const formatted = this.jalaliPipe.transform(res.dueDate);
      // => "19:35:00 _ 1404/02/31"
      // جدا کردن ساعت و تاریخ
      const [time, date] = formatted.split(' _ ');
      this.selectedHourTime = time.split(':')[0]; // "19"
      this.selectedMinuteTime = time.split(':')[1]; // "35"

      // this.selectedHourTime = moment(res.dueDate).locale('fa').format('HH').toString()
      // this.selectedMinuteTime = moment(res.dueDate).locale('fa').format('mm').toString()


      if (this.newActivity.activityTypeId) {
        const index = this.activityList.findIndex(item => item.id === this.newActivity.activityTypeId);
        this.selectedIndex = index !== -1 ? index : null;
      } else {
        this.selectedIndex = null;
      }

      this.showModalNewActivity = true;
    },error => {
      this.loading.hide();
      this.showModalNewActivity = true;
    })
  }

  changeMainPhoto(event:any) {
    this.urlFile = event.map((file: any) => {
      if (file.id) {
        return {id: file.id, title: file.title};
      } else {
        return {fileName: file.fileName, title: file.title};
      }
    });
  }

  closePanel() {
    this.isCollapsed = true;
    this.showModalNewActivity = false;
  }


  open(state: any, data?: any) {
    this.modalState = state;
    this.showModalNewActivity = true;
    if (state == 'new'){
      this.companyName = null;
      this.workItem = null;
      this.newActivity = new CreateActivityType({});
      // this.reminders = [new TimePeriod()];
      // this.setTodayDate() // بازنشانی تاریخ
      this.reminders = [];
      this.selectedMinuteTime = null;
      this.selectedHourTime = null;
      this.uploadFileComponent.reset();
      if (this.activityList.length > 0) {
        const firstItem = this.activityList[0];
        this.selectedIndex = 0;
        this.newActivity.activityTypeId = firstItem.id;
        this.newActivity.title = firstItem.title;
        this.newActivity.duration = firstItem.defaultDuration;
      } else {
        this.selectedIndex = null;
      }
    }

    if (this.user.userType === this.UserTypesEnum.Expert){
      // this.newActivity.userId = this.user.id;
      this.newActivity.userId = null;

    }
    // if (data) {
    //   this.newActivity = { ...data };
    // }
    // else {
    //
    //
    // }

  }


  addReminder() {
    this.reminders.push(new TimePeriod());
  }

  deleteReminder(index: number) {
    this.reminders.splice(index, 1);
  }

}

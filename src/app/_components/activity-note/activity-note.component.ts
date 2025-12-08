import {ChangeDetectorRef, Component, EventEmitter, input, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownChangeEvent, DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {StepperModule} from "primeng/stepper";
import {PanelModule} from "primeng/panel";
import {MenuModule} from "primeng/menu";
import {InputTextModule} from "primeng/inputtext";
import {IActiveDate, NgPersianDatepickerModule} from "ng-persian-datepicker";
import {KeyFilterModule} from "primeng/keyfilter";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {InputTextareaModule} from "primeng/inputtextarea";
import {EditorModule} from "primeng/editor";
import {DialogModule} from "primeng/dialog";
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {ActivityType} from "../../setting/_types/activity.type";
import {UserTypeBase} from "../../setting/_types/user.type";
import {CustomerSpecification, WorkItemType} from "../../path/_types/create-work-item.type";
import {AttachmentType, CreateActivityType, CreateAttachmentDTO, TimePeriod} from "../../_types/create-activity.type";
import {NoteType} from "../../work-item/_types/note.type";
import {WorkItemService} from "../../work-item/work-item.service";
import {LoadingService} from "../../_services/loading.service";
import {CustomMessageService} from "../../_services/custom-message.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Utilities} from "../../_classes/utilities";
import {FileTypeEnum, FileTypeEnum2LabelMapping} from "../../_enums/file-type.enum";
import {FileUploadEvent, FileUploadHandlerEvent, FileUploadModule} from "primeng/fileupload";
import {ActivityNoteService} from "./activity-note.service";
import {UploadFileComponent} from "../upload-file/upload-file.component";
import {OverlayPanel, OverlayPanelModule} from "primeng/overlaypanel";
import {ActivityWorkItemType} from "../../work-item/_types/activity-workItem.type";
import {CustomerService} from "../../setting/_services/customer.service";
import {HttpResponse} from "@angular/common/http";
import moment from "jalali-moment";
import {ConfirmationService, MessageService} from "primeng/api";
import {AccordionModule} from "primeng/accordion";
import {ActivitiesService} from "../../activities/activities.service";
import {TimeUnitsEnum, TimeUnitsEnum2LabelMapping} from "../../_enums/TimeUnits.enum";
import {TooltipModule} from "primeng/tooltip";
import {take} from "rxjs/operators";
import {AuthenticationService} from "../../_services/authentication.service";
import {LoginOutputSscrmType} from "../../_types/login-output.type";
import {UserTypesEnum} from "../../_enums/user-types.enum";
import {NewActivityModalComponent} from "../new-activity-modal/new-activity-modal.component";
import {ChangeLogType} from "../../_types/change-log.type";
import {WorkItemChangeLogTypesEnum2LableMapping} from "../../_enums/workItem-change-log-types.enum";
import {BadgeModule} from "primeng/badge";

@Component({
  selector: 'app-activity-note',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    DividerModule,
    StepperModule,
    PanelModule,
    MenuModule,
    NgIf,
    NgFor,
    InputTextModule,
    NgPersianDatepickerModule,
    ReactiveFormsModule,
    KeyFilterModule,
    AutoCompleteModule,
    InputTextareaModule,
    EditorModule,
    DialogModule,
    JalaliDatePipe,
    FileUploadModule,
    UploadFileComponent,
    OverlayPanelModule,
    AccordionModule,
    TooltipModule,
    NewActivityModalComponent,
    BadgeModule
  ],
  templateUrl: './activity-note.component.html',
  styleUrl: './activity-note.component.scss',
  providers:[JalaliDatePipe]
})
export class ActivityNoteComponent implements OnInit{


  fileType:any
  TimeUnits:any
  fileTypeValue:any
  urlFile = []
  selectedFileType:any

  showModal:boolean = false;
  showModalNewNote:boolean = false;
  showModalNewActivity:boolean = false;
  modalState = 'new' || 'edit';

  @Input() workItem?: WorkItemType;
  @Input() workItemId?: string;
  @Input() ticketId?: string;
  @Input() customerId?: string;
  @Input() expertId?: number;
  @Input() pathId?: number | null = null;
  isCollapsed: boolean = true;
  activeContent: string | null = null;
  startDate!: string;
  startDateTimeControl = new FormControl();

  userList: UserTypeBase[]=[];
  expertUsers: UserTypeBase[];
  selectedExpert:UserTypeBase
  activityIdForChangeExpert:number;

  activityList: ActivityType[]=[];
  noteData: NoteType[] = [];
  newNoteData : NoteType = new NoteType({})
  attachmentData: AttachmentType[] = [];
  activityData:ActivityWorkItemType[] = [];
  newActivity : CreateActivityType = new CreateActivityType({})
  filteredCustomer: CustomerSpecification[];
  filteredWorkItem: WorkItemType[];
  newAttachment:CreateAttachmentDTO = new CreateAttachmentDTO({})

  hourTime = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','21','23',];
  minuteTime = ['00','05','10','15','20','25','30','35','40','45','50','55'];
  selectedHourTime: string = undefined;
  selectedMinuteTime: string;

  workItemTitle: string = '';
  companyName: string = '';
  selectedIndex: number | null = null;
  showCommentModal:boolean = false;
  newComment:string | null;
  notePageInfo = { from: 0, rows: 20, isLoading: false, hasMore: true };
  activityPageInfo = { from: 0, rows: 20, isLoading: false, hasMore: true };
  isAttachment:boolean = false;
  seletedActivityId: string;
  showDoneActivityModal: boolean = false
  resultActivity:string;
  reminders: TimePeriod[] = [];
  doneActivities = [];
  undoneActivities = [];

  showChangeExpertModal: boolean = false
  showResultActivityModal:boolean = false;
  showResult:string;

  changeLog: ChangeLogType[];
  WorkItemChangeLogTypesEnum2LableMapping = WorkItemChangeLogTypesEnum2LableMapping;

  user:LoginOutputSscrmType|undefined = undefined;
  protected readonly UserTypesEnum = UserTypesEnum

  @ViewChild('op') op!: OverlayPanel;
  @ViewChild('uploadFileComponent') uploadFileComponent!: UploadFileComponent;
  @ViewChild('newActivityModal') newActivityModal!: NewActivityModalComponent;


  constructor(private workItemService: WorkItemService,
              private customerServices: CustomerService,
              private activeNoteervice: ActivityNoteService,
              private activityService: ActivitiesService,
              private loading: LoadingService,
              private messagesService: CustomMessageService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private cdRef: ChangeDetectorRef,
              private sanitizer:DomSanitizer,
              private jalaliPipe:JalaliDatePipe,
              private authService:AuthenticationService,) {
    this.fileType = Utilities.ConvertEnumToKeyPairArray(FileTypeEnum , FileTypeEnum2LabelMapping)
    this.TimeUnits = Utilities.ConvertEnumToKeyPairArray(TimeUnitsEnum,TimeUnitsEnum2LabelMapping)

    authService.token?.pipe(take(1)).subscribe(token => {
      this.user = token
    });

  }

  ngOnInit() {
    // this.getListOfActivity()
    this.getListOfUsers()
    this.setActive('activities');
    this.getChangeLogData()
    this.reminders = [new TimePeriod()];
  }


  onScrollContainer(event: any) {
    const element = event.target;
    const threshold = 100;

    const reachedBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + threshold;

    if (!reachedBottom) return;

    if (this.activeItem === 'notes') {
      if (!this.notePageInfo.isLoading && this.notePageInfo.hasMore) {
        this.getListOfNotes();
      }
    }

    if (this.activeItem === 'activities') {
      if (!this.activityPageInfo.isLoading && this.activityPageInfo.hasMore) {
        this.getListOfActivities();
      }
    }
  }

  // لیست یادداشت ها
  getListOfNotes(){
    if (this.notePageInfo.isLoading || !this.notePageInfo.hasMore) return;

    this.loading.show();
    this.notePageInfo.isLoading = true;
    const input = {
      id: this.workItemId ? this.workItemId : this.customerId ? this.customerId : null,
      from: this.notePageInfo.from,
      row: this.notePageInfo.rows,
      state: this.workItemId ? 'workItem' : 'customer'
    };
    this.activeNoteervice.getListOfNote(input).subscribe((res) => {
      this.loading.hide()
      this.notePageInfo.isLoading = false;

      if (res.items.length < this.notePageInfo.rows) this.notePageInfo.hasMore = false;

      this.noteData = [...this.noteData, ...res.items];
      this.notePageInfo.from += res.items.length;

    },  error => {
      this.loading.hide();
      this.notePageInfo.isLoading = false;
    })
  }

  // لیست فعالیت ها
  getListOfActivities(){
    if (this.activityPageInfo.isLoading || !this.activityPageInfo.hasMore) return;
    this.loading.show();
    this.activityPageInfo.isLoading = true;
    const input = {
      id: this.workItemId || this.customerId,
      from: this.activityPageInfo.from,
      row: this.activityPageInfo.rows,
      state: this.workItemId ? 'workItem' : 'customer'
    };
    this.activeNoteervice.getListOfActivities(input).subscribe((res) => {
      this.loading.hide();
      this.activityPageInfo.isLoading = false;

      if (res.items.length < this.activityPageInfo.rows) this.activityPageInfo.hasMore = false;

      res.items.forEach(activity => {
        if (activity.doneDate && activity.doneDate !== '') {
          this.doneActivities.push(activity);
        } else {
          this.undoneActivities.push(activity);
        }
      });
      // this.doneActivities = [...(this.doneActivities || []), ...this.doneActivities];
      // this.undoneActivities = [...(this.undoneActivities || []), ...this.undoneActivities];

      this.activityData = [...this.activityData, ...res.items];
      this.activityPageInfo.from += res.items.length;

    },  error => {
      this.loading.hide();
      this.activityPageInfo.isLoading = false;
    })
  }

  // لیست پیوست ها
  getListOfAttachment(){
    this.loading.show()
    const input = {
      id: this.workItemId || this.customerId,
      state: this.workItemId ? 'workItem' : 'customer'
    };
    this.activeNoteervice.getAttachments(input).subscribe((res) => {
      this.loading.hide();
      this.attachmentData = res;
    }, error => {
      this.loading.hide();
    })
  }

  // تاریخچه تغییرات
  getChangeLogData(){
    if (this.workItemId || this.ticketId){
      this.loading.show()
      this.workItemService.changeLog(this.workItemId ? this.workItemId : this.ticketId).subscribe((res)=>{
        this.loading.hide()
        this.changeLog = res;
      }, error => {
        this.loading.hide()
      })
    }
  }

  // دانلود فایل پیوست شده
  onDownloadFiles(event:any){
    this.loading.show();
    const input = {
      id: event.id,
      title: event.title
    }
    this.activeNoteervice.onDownloadFileAttachment(input).subscribe((response: HttpResponse<Blob>) =>{
      this.loading.hide();
      // دریافت مقدار Content-Disposition
      // const contentDisposition = response.headers.get('Content-Disposition') || '';

      // استخراج نام فایل
      // let filename = 'downloaded_file';
      // const match = contentDisposition.match(/filename\*=UTF-8''(.+)/);
      // if (match && match.length > 1) {
      //   filename = decodeURIComponent(match[1]); // تبدیل نام فایل به فرمت خوانا
      // } else {
      //   const fallbackMatch = contentDisposition.match(/filename="(.+?)"/);
      //   if (fallbackMatch && fallbackMatch.length > 1) {
      //     filename = fallbackMatch[1];
      //   }
      // }

      // console.log('Filename:', filename);

      const blob = response.body!;
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      // a.download = filename; // نام فایل
      a.download = event.title; // نام فایل
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(objectUrl);

      this.messagesService.showSuccess('فایل با موفقیت دانلود شد.')
    }, error => {
      this.loading.hide();
    })
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
      this.cdRef.detectChanges();
    }, error => {
      this.loading.hide();
    })
  }

  // لیست کارشناس ها
  getListOfUsers(){
    this.loading.show();
    this.workItemService.getListOfUsers(this.pathId).subscribe((res) =>{
      this.loading.hide();
      this.userList = res;
      this.expertUsers = res;
    }, error => {
      this.loading.hide();
    })
  }

  // افزودن فعالیت جدید
  onRegisterActivity(mode:string) {
    if (this.newActivity.title === undefined || this.newActivity.title == null){
      return this.messagesService.showError('عنوان فعالیت اجباری می باشد.')
    }
    if (this.newActivity.userId === undefined || this.newActivity.userId == null){
      this.newActivity.userId = this.expertId
      // return this.messagesService.showError('مسئول انجام فعالیت اجباری می باشد.')
    }

    this.loading.show();

    if (this.selectedIndex !== null && this.activityList[this.selectedIndex]) {
      this.newActivity.iconClass = this.activityList[this.selectedIndex].iconClass ?? ''
    } else { this.newActivity.iconClass = '' }

    if (this.user.userType === UserTypesEnum.Expert){
      this.newActivity.userId = this.user.id
    }

    if (this.workItemId){
      this.newActivity.workItemId = +this.workItemId
    } else if (this.customerId) {
      this.newActivity.customerId = +this.customerId
    } else {
      this.newActivity.workItemId = null
      this.newActivity.customerId = null
    }
    if (this.shouldShowReminderFields()) {
      this.newActivity.reminders = this.reminders;
    } else {
      this.newActivity.reminders = [];
    }

    this.newActivity.dueDate = this.startDate ? this.startDate.trim()?.concat('T' + `${this.selectedHourTime ? this.selectedHourTime : '00' }:${this.selectedMinuteTime ? this.selectedMinuteTime + ':00' : '00:00'}`) : null;
    this.newActivity.attachments = this.urlFile

    this.workItemService.onCreateUpdateNewActivity(this.newActivity,mode).subscribe((res) =>{
      this.loading.hide();
      this.isCollapsed = true;

      this.activityData = [];
      this.doneActivities = [];
      this.undoneActivities = [];
      this.activityPageInfo = { from: 0, rows: 20, isLoading: false, hasMore: true };
      this.setActive('activities')
      this.showModalNewActivity = false
      this.messagesService.showSuccess('عملیات با موفقیت ثبت شد.')
    }, error => {
      this.loading.hide();
    })
  }

  // تغییر کارشناس یک فعالیت
  onChangeExpertActivity(){
    this.loading.show();
    const input = {
      activityId: this.activityIdForChangeExpert,
      userId: +this.selectedExpert
    }
    this.activeNoteervice.changeExpertActivity(input).subscribe(res => {
      this.loading.hide();
      this.showChangeExpertModal = false;
      this.selectedExpert = null;
      this.messagesService.showSuccess('کارشناس فعالیت با موفقیت تغییر یافت');
    }, error => {
      this.loading.hide();
    })
  }

  onShowExpertActivityModal(id:number){
    this.showChangeExpertModal = true;
    this.activityIdForChangeExpert = id
  }

  onCloseExpertChangeModal(){
    this.showChangeExpertModal = false;
    this.selectedExpert = null;
  }

  // افزودن یادداشت جدید
  addNewDescription(mode:string) {
    this.loading.show();
    const input = {
      content: this.newNoteData.content,
      attachments:this.urlFile,
      ...(mode === 'new' ? this.workItemId
          ? { workItemId: +this.workItemId }
          : { customerId: +this.customerId }
        : { id: this.newNoteData.id })
    };

    this.modalState = mode

    this.workItemService.onCreateUpdateNewDescription(input, this.modalState).subscribe((res) =>{
      this.loading.hide();
      this.isCollapsed = true;
      this.showModalNewNote = false;
      this.noteData = [];
      this.notePageInfo = { from: 0, rows: 20, isLoading: false, hasMore: true };
      this.setActive('notes')
      this.messagesService.showSuccess('عملیات با موفقیت ثبت شد.')
    }, error => {
      this.loading.hide()
    })
  }

  // افزودن پیوست جدید
  addNewAttachement(){
    this.loading.show();
    let input = {
      AttachmentTypes: this.fileTypeValue,
      url: this.urlFile,
      title : this.newAttachment.title,
      ...(this.workItemId
        ? { workItemId: +this.workItemId }
        : { customerId: +this.customerId })
    }
    this.activeNoteervice.onAddAttachment(input).subscribe(res =>{
      this.loading.hide();
      this.showModal = false;
      this.setActive('attachment');
      this.messagesService.showSuccess('عملیات با موفقیت انجام شد.')
    }, error => {
      this.loading.hide();
    })
  }

  // ثبت نظر در فعالیت ها
  onNewCommnet() {
    this.loading.show();
    const input = {
      content: this.newComment,
      activityId: this.activityId
    }
    this.workItemService.onAddNewComment(input).subscribe(res =>{
      this.loading.hide();
      this.showCommentModal = false;

      this.activityData = [];
      this.doneActivities = [];
      this.undoneActivities = [];
      this.activityPageInfo = { from: 0, rows: 20, isLoading: false, hasMore: true };
      this.setActive('activities')
      this.messagesService.showSuccess('نظر شما با موفقیت ثبت شد')
    }, error => {
      this.loading.hide();
    })
  }


  onClickEditActivity(id:number){
    this.newActivityModal.onShowModalEditActivity(id);
  }

  onClickHistoryActivity(id:number){
    this.newActivityModal.onShowModalEditActivity(id);
  }

  // // گرفتن اطلاعات یک فعالیت برای ویرایش
  // onShowModalEditActivity(id:number,mode:string) {
  //   this.loading.show();
  //   this.modalState = mode
  //   this.activeNoteervice.getActivityById(id).subscribe(res =>{
  //     this.loading.hide()
  //     this.newActivity = res
  //     this.reminders = this.newActivity.reminders ?? [];
  //     this.startDateTimeControl.patchValue(moment(res.dueDate).locale('fa').format('YYYY-MM-DD').toString())
  //     this.selectedHourTime = moment(res.dueDate).locale('fa').format('HH').toString()
  //     this.selectedMinuteTime = moment(res.dueDate).locale('fa').format('mm').toString()
  //
  //     if (this.newActivity.activityTypeId) {
  //       const index = this.activityList.findIndex(item => item.id === this.newActivity.activityTypeId);
  //       this.selectedIndex = index !== -1 ? index : null;
  //     } else {
  //       this.selectedIndex = null;
  //     }
  //
  //     this.showModalNewActivity = true;
  //   },error => {
  //     this.loading.hide();
  //     this.showModalNewActivity = true;
  //   })
  // }



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
            this.activityData = [];
            this.doneActivities = [];
            this.undoneActivities = [];
            this.activityPageInfo = { from: 0, rows: 20, isLoading: false, hasMore: true };
            this.setActive('activities')
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

  // گرفتن اطلاعات برای ویرایش یادداشت
  onShowModalEditNote(id:number,mode:string) {
    this.modalState = mode
    const selectedNote = this.noteData.find(note => note.id === id);
    console.log(selectedNote)
    if (selectedNote){
      this.newNoteData = new NoteType(selectedNote);
      this.showModalNewNote = true;
    }
  }

  // حذف یادداشت
  deleteItemNote(id: number){
    this.confirmationService.confirm({
      header: 'حذف',
      message: 'آیا از انجام حذف اطمینان دارید؟',

      accept: () => {
        this.activeNoteervice.deleteNoteById(id).subscribe({
          next: () => {
            this.notePageInfo = { from: 0, rows: 20, isLoading: false, hasMore: true };
            this.getListOfNotes()
            this.messageService.add({
              severity: 'success',
              summary: 'موفق',
              detail: 'حذف با موفقیت انجام شد.',
            });
            this.setActive('notes');
          },
          error: () => {
          },
        });
      },
    });
  }

  // حذف پیوست
  deleteItemAttachment(id: number){
    this.confirmationService.confirm({
      header: 'حذف',
      message: 'آیا از انجام حذف اطمینان دارید؟',

      accept: () => {
        this.activeNoteervice.deleteAttachmentById(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'موفق',
              detail: 'حذف با موفقیت انجام شد.',
            });
            this.setActive('attachment');
          },
          error: () => {
          },
        });
      },
    });
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

  // نتیجه فعالیت انجام شده
  onDoneActivity(){
    this.loading.show()
    const input = {
      id: this.seletedActivityId,
      result: this.resultActivity
    }
    this.activityService.onDoneActivity(input).subscribe((res) =>{
      this.loading.hide()
      this.messagesService.showSuccess('عملیات با موفقیت انجام شد.')
      this.showDoneActivityModal = false;

      this.activityData = [];
      this.doneActivities = [];
      this.undoneActivities = [];
      this.activityPageInfo = { from: 0, rows: 20, isLoading: false, hasMore: true };
      this.setActive('activities')

    }, error => {
      this.loading.hide()
    })
  }

  // ****  تب های افزودن فعالیت و افزودن یادداشت ****
  toggleContent(content: string): void {
    if (this.activeContent === content && !this.isCollapsed) {
      // Collapse if clicking the same button
      this.isCollapsed = true;
      this.activeContent = null;
    } else {
      // Open and display the respective content
      this.activeContent = content;
      this.isCollapsed = false;
    }
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

  onResultActivity(item:any){
    this.showResultActivityModal = true;
    this.showResult= item.result;

  }

  // **************** start Date Picker ****************
  initialStartDatePicker(event: any) {
    this.startDate = event.gregorian;
  }

  selectStartDate(event: any) {
    this.startDate = event.gregorian
  }

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
    if (!this.isReminderDisabled && this.reminders.length === 0) {
      this.reminders = [new TimePeriod()];
    }

    return true; // همیشه نمایش بده

  }

  // **************** end Date Picker ****************

  sanitizeContent(content: string) {
    return  this.sanitizer.bypassSecurityTrustHtml(content);
  }

  // **** نمایش تب فعالیت ها و یادداشت ها ****
  activeItem:string = '';
  setActive(item: string) {
    this.activeItem = item
    if (item === 'notes'){
      this.notePageInfo = { from: 0, rows: 20, isLoading: false, hasMore: true };
      this.noteData= []
      this.getListOfNotes()
    } else if (item === 'activities'){
      this.activityPageInfo = { from: 0, rows: 20, isLoading: false, hasMore: true };
      this.activityData = [];
      this.doneActivities = [];
      this.undoneActivities = [];
      this.getListOfActivities()
    } else if (item === 'attachment') {
      this.getListOfAttachment()
    }
  }

  activityId:number | null;
  onOpenCommentModal(id:number) {
    this.activityId = id
    this.newComment = null;
    this.showCommentModal = true;
  }

  onCloseCommentModal() {
    this.showCommentModal = false;
    this.newComment = null;
    this.activityId = null;
  }

  closePanel() {
    this.isCollapsed = true;
    this.showModalNewActivity = false;
    this.showModalNewNote = false;
    this.uploadFileComponent.reset();
  }

  modalNewActivity(mode:string){
    // this.showModalNewActivity = true;
    this.modalState = mode;
    this.newActivityModal.open(this.modalState)
    // this.newActivity = new CreateActivityType({});
    // this.reminders = [new TimePeriod()];
    // this.selectedMinuteTime = null;
    // this.selectedHourTime = null;
    // this.uploadFileComponent.reset()
    // if (this.newActivity.activityTypeId) {
    //   const index = this.activityList.findIndex(item => item.id === this.newActivity.activityTypeId);
    //   this.selectedIndex = index !== -1 ? index : null;
    // } else {
    //   this.selectedIndex = null;
    // }
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

  modalNewNote(mode:string){
    this.showModalNewNote = true;
    this.modalState = mode;
    this.newNoteData = new NoteType({})
    this.uploadFileComponent.reset()
  }

  showModalAttachment(item: any){
    this.showModal= true;
    this.fileTypeValue = item;
  }

  doneActivityModal(id:any) {
    this.seletedActivityId = id
    this.showDoneActivityModal = true
    this.resultActivity = null;
  }

  changeMainPhoto(event:any) {
    // if (!event || event.length === 0) {
    //   console.warn("فایل معتبر دریافت نشد.");
    //   return;
    // }

    // this.urlFile = event[0];
    // this.urlFile = event.map((file: any) => {
    //   if (file.id) {
    //     return {id: file.id, title: file.title};
    //   } else {
    //     return {fileName: file.fileName, title: file.title};
    //   }
    // });

    this.urlFile = event.map((file: any) => ({
      id: file.id,               // اگر قدیمی باشه
      fileName: file.fileName,   // اگر جدید باشه
      title: file.title
    }));

    this.cdRef.detectChanges();
    // console.log(this.urlFile);
  }

  resetModal(){
    this.newAttachment.title = '';
    this.changeMainPhoto(null);
    this.showModal = false;
  }

  // openedCommentIndex: number | null = null;
  // toggleComments(index: number) {
  //   if (this.openedCommentIndex === index) {
  //     this.openedCommentIndex = null; // اگر دوباره کلیک شد، ببند
  //   } else {
  //     this.openedCommentIndex = index; // آیتم جدید باز کن
  //   }
  // }

  openedDoneCommentIndex: number | null = null;
  openedUndoneCommentIndex: number | null = null;
  toggleDoneComments(index: number) {
    this.openedDoneCommentIndex = this.openedDoneCommentIndex === index ? null : index;
  }

  toggleUndoneComments(index: number) {
    this.openedUndoneCommentIndex = this.openedUndoneCommentIndex === index ? null : index;
  }

  addReminder() {
    this.reminders.push(new TimePeriod());
  }

  deleteReminder(index: number) {
    this.reminders.splice(index, 1);
  }

}

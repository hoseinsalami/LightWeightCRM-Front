import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CommonModule, Location, NgFor, NgIf} from "@angular/common";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {StepperModule} from "primeng/stepper";
import {PanelModule} from "primeng/panel";
import {MenuModule} from "primeng/menu";
import {WorkItemService} from "./work-item.service";
import {LoadingService} from "../_services/loading.service";
import {ActivityType} from "../setting/_types/activity.type";
import {InputTextModule} from "primeng/inputtext";
import {IActiveDate, NgPersianDatepickerModule} from "ng-persian-datepicker";
import {KeyFilterModule} from "primeng/keyfilter";
import {UserTypeBase} from "../setting/_types/user.type";
import {AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {CustomerSpecification, WorkItemType} from "../path/_types/create-work-item.type";
import {CreateActivityType} from "../_types/create-activity.type";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {EditorModule} from "primeng/editor";
import {NoteType} from "./_types/note.type";
import {CustomMessageService} from "../_services/custom-message.service";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivityWorkItemType} from "./_types/activity-workItem.type";
import {PathService} from "../path/path.service";
import {PathWorkItemsDetailType} from "../path/_types/path-work-items-detail.type";
import {DialogModule} from "primeng/dialog";
import {FailureReasonsType, WorkItemStatusType} from "./_types/work-item-status.type";
import {WorkItemStatesEnum, WorkItemStatesEnum2LabelMapping} from "../path/_enums/work-item-states.enum";
import {Utilities} from "../_classes/utilities";
import {JalaliDatePipe} from "../_pipes/jalali.date.pipe";
import {ActivityNoteComponent} from "../_components/activity-note/activity-note.component";
import {ActivityNoteService} from "../_components/activity-note/activity-note.service";
import {SignalRService} from "../_services/signal-r.service";
import {TooltipModule} from "primeng/tooltip";
import {AuthenticationService} from "../_services/authentication.service";
import {CariesService} from "../setting/_services/caries.service";
import {switchMap} from "rxjs";
import {ConfirmationService} from "primeng/api";
import {TagTypeBase} from "../setting/_types/tag.type";
import {OverlayPanel, OverlayPanelModule} from "primeng/overlaypanel";
import {ConfirmPopupModule} from "primeng/confirmpopup";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {BadgeModule} from "primeng/badge";

@Component({
  selector: 'app-work-item',
  templateUrl: './work-item.component.html',
  styleUrl: './work-item.component.scss',
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
    ActivityNoteComponent,
    RouterLink,
    TooltipModule,
    OverlayPanelModule,
    BadgeModule,
    ConfirmPopupModule,
    ConfirmDialogModule
  ]
})
export class WorkItemComponent implements OnInit{

  optionInspectors:CustomerSpecification[];
  selectedInspectors:any;

  activeContent: string | null = null;
  isCollapsed: boolean = true;
  selectedIndex: number | null = null;

  activityList: ActivityType[]=[];
  // userList: UserTypeBase[]=[];

  startDate!: string;
  startDateTimeControl = new FormControl();

  hourTime = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','21','23',];
  minuteTime = ['00','05','10','15','20','25','30','35','40','45','50','55'];
  selectedHourTime: string;
  selectedMinuteTime: string;

  filteredCustomer: CustomerSpecification[];
  filteredWorkItem: WorkItemType[];

  newActivity : CreateActivityType = new CreateActivityType({})
  newDescription: NoteType = new NoteType({})

  activityData:ActivityWorkItemType[];

  workItem:WorkItemType;
  workItemTitle: string = '';
  attachmentTitle: string = '';
  companyName: string = '';
  workItemId:string;
  pathId:string;
  listOfStep: PathWorkItemsDetailType[];

  showFailureModal:boolean = false;
  showCommentModal:boolean = false;
  newComment:string | null;

  listOfFailureReasons: FailureReasonsType[] = []
  selectedFailureReasons:any;
  workItemStatus: WorkItemStatusType = {};
  workItemStatesEnum:any

  pageInfo = {
    from: 0,
    rows : 5
  }

  expertUsers: UserTypeBase[];
  selectedExpert:UserTypeBase;
  userType:number;
  showChangeExpertModal:boolean = false;
  showDialogMessage:boolean = false

  customerId:any;

  listOfTag:TagTypeBase[] = [];
  selectedTags: any[] = [];

  newTitlePhoneNumber?: string;
  newPhoneNumber?: string;
  newTitleWorkItem?: string;

  protected readonly WorkItemStatesEnum = WorkItemStatesEnum

  constructor(private service: WorkItemService,
              private activeNoteervice: ActivityNoteService,
              private authenticationService: AuthenticationService,
              private pathService: PathService,
              private loading: LoadingService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private messagesService: CustomMessageService,
              private confirmationService: ConfirmationService,
              private sanitizer:DomSanitizer,
              private signal : SignalRService,
              private location: Location) {
    this.workItemStatesEnum = Utilities.ConvertEnumToKeyPairArray(WorkItemStatesEnum, WorkItemStatesEnum2LabelMapping)
    this.activatedRoute.params.subscribe(res =>{
      if (res['id']){
        this.workItemId = res['id']
      }
    })
    this.pathId = localStorage.getItem('pathId')
  }

  ngOnInit() {
    this.authenticationService.token.subscribe(res =>{
      this.userType = res.userType
    })

    this.getWorkItem()
    this.getPathSteps();
    this.getReasonsFailure();
    this.getListOfTag();
    // this.loadWorkItemAndExperts()
  }

  getPathSteps(){
    this.service.getPathSteps(this.pathId).subscribe((res)=>{
      this.listOfStep = res;
    })
  }

  // loadWorkItemAndExperts() {
  //   this.loading.show();
  //   this.service.getDetailWorkItem(this.workItemId).pipe(
  //     switchMap((workItem) => {
  //       this.workItem = workItem;
  //       this.workItemTitle = workItem.title;
  //       return this.pathService.listOfExpertUsers(String(workItem.pathId));
  //     })
  //   ).subscribe(
  //     (expertUsers) => {
  //       this.expertUsers = expertUsers;
  //       this.loading.hide();
  //     },
  //     (error) => {
  //       this.loading.hide();
  //     }
  //   );
  // }

  getWorkItem(){
    this.loading.show();
    this.service.getDetailWorkItem(this.workItemId).subscribe((res) => {
      this.loading.hide()
      this.workItem = res;
      this.customerId = String(this.workItem.customer.id)
      this.workItemTitle = this.workItem.title;

      if (this.workItem && this.workItem.tags.length) {
        this.selectedTags = this.workItem.tags;
      }

      this.getListOfUserExperts();
      // this.companyName = this.workItem?.customer?.companyName
      // console.log(this.workItemTitle)

    }, error => {
      this.loading.hide()
    })
  }

  getListOfTag(){
    this.loading.show();
    this.service.getTagsWorkItem().subscribe({
      next: (out) => {
        this.loading.hide();
        this.listOfTag = out.items
      },
      error: (err) => {
        this.loading.hide();
      }
    })
  }

  onAssignTag(tag:TagTypeBase,tagOp: OverlayPanel){
    const exists = this.selectedTags.some(t => t.id === tag.id);
    if (exists) {
      tagOp.hide();
      this.messagesService.showError('این تگ قبلاً انتخاب شده است.');
      return;
    }

    this.loading.show();
    const input = {
      tagId:tag.id,
      workItemId: this.workItem.id
    }
    this.service.onAssignTag(input).subscribe({
      next: (out) =>{
        this.loading.hide();
        tagOp.hide();
        const exists = this.selectedTags.some(t => t.title === tag.title)
        if (!exists){
          this.selectedTags.push(tag);
        }
      },
      error: (err) =>{
        this.loading.hide();
        tagOp.hide();
      }
    })
  }

  onDeleteTag(tag:TagTypeBase){
    this.loading.show();
    const input = {
      tagId:tag.id,
      workItemId: this.workItem.id
    }
    this.service.deleteTag(input).subscribe({
      next: (out) => {
        this.loading.hide();
        this.selectedTags = this.selectedTags.filter(t => t !== tag)
      },
      error: (err) =>{
        this.loading.hide()
      }
    })
  }

  changeStatusStep(stepId:number){
    this.loading.show();
    const input = {
      workItemId : +this.workItemId,
      stepId : stepId
    }
    this.service.onChangeStatusSteps(input).subscribe((res)=>{
      this.loading.hide();
      this.messagesService.showSuccess('عملیات با موفقیت انجام شد.')
    }, error => {
      this.loading.hide();
    })
  }

  changeExpertWorkItem(){
    this.loading.show();
    const input ={
      workItemId: +this.workItemId,
      userId: +this.selectedExpert
    }
    this.service.onChangeExpert(input).subscribe(res =>{
      this.loading.hide();
      this.showChangeExpertModal = false;
      this.selectedExpert = null
      this.getWorkItem()
      this.messagesService.showSuccess('کارشناس با موفقیت تغییر کرد.')
    }, error => {
      this.loading.hide();
    })
  }

  getListOfUserExperts() {
    this.loading.show()
    this.pathService.listOfExpertUsers(String(this.workItem.pathId)).subscribe((res) =>{
      this.loading.hide();
      this.expertUsers = res
    }, error => {
      this.loading.hide();
    })
  }

  goToStep(index: number) {

    this.confirmationService.confirm({
      header: 'تغییر گام',
      message: 'آیا از تغییر گام مطمئن هستید؟',

      accept: () => {
        this.workItem.stepId = index;
        this.changeStatusStep(this.workItem.stepId)
      }
    })



  }

  getReasonsFailure(){
    this.loading.show();
    this.service.onFailureReasons().subscribe((res) =>{
      this.loading.hide();
      this.listOfFailureReasons = res
    }, error => {
      this.loading.hide()
    })
  }

  onCompleteWorkItem(state:any) {
    this.loading.show();
    this.workItemStatus.newState = state
    // this.workItemStatus.failureReasonId = undefined
    // this.workItemStatus.description = undefined;
    this.workItemStatus.workItemId = +this.workItemId
    if (state === this.WorkItemStatesEnum.Failed && this.workItemStatus.failureReasonId == null){
      return this.messagesService.showError('دلیل شکست فعالیت مشخص نشده است ')
    }
    this.service.onChangeStatusWorkItem(this.workItemStatus).subscribe(res =>{
      this.loading.hide();
      this.showFailureModal = false;
      this.getWorkItem();
    }, error => {
      this.loading.hide()
    })

  }

  onFailureWorkItem() {
    this.loading.show();
    this.workItemStatus.workItemId = +this.workItemId;
    this.workItemStatus.newState = this.WorkItemStatesEnum.Failed;
    this.service.onChangeStatusWorkItem(this.workItemStatus).subscribe(res =>{
      this.loading.hide();
      this.showFailureModal = false;
      this.getWorkItem();
    }, error => {
      this.loading.hide()
    })

  }

  onDeleteWorkItem(workItem:any){
    this.confirmationService.confirm({
      header: 'حذف',
      message: 'آیا از انجام حذف اطمینان دارید؟',
      accept: () => {
        this.loading.show()
        this.service.deleteWorkItem(workItem.id, true).subscribe({
          next: (out) =>{
            this.loading.hide()
            // this.router.navigate(['/path',workItem.pathId]).then()
            this.router.navigateByUrl('/path/' + workItem.pathId, { replaceUrl: true });
            this.messagesService.showSuccess('عملیات با موفقیت انجام شد.');
          },
          error: () => {
            this.loading.hide()
          }
        })
      }
    })
  }

  onChangeTitleWorkItem(workitem:any){
    this.confirmationService.confirm({
      key: 'changeTitle',
      header: 'ویرایش عنوان معامله',
      message: '',
      acceptIcon: 'pi pi-check mr-2',
      rejectIcon: 'pi pi-times mr-2',
      rejectButtonStyleClass: 'p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.loading.show();
        const input = {
          workItemId: workitem.id,
          title: this.newTitleWorkItem
        }
        this.service.putChangeTitleWorkItem(input).subscribe({
          next: (out) =>{
            this.loading.hide();
            this.newTitleWorkItem = null;
            this.getWorkItem()
          },
          error: (err) => {
            this.loading.hide()
          }
        })
      },
      reject: () =>{
        this.newTitleWorkItem = null;
      }
    })
  }

  addNewCustomerPhone(event: Event){
    this.confirmationService.confirm({
      key: 'addPhone',
      target: event.target as EventTarget,
      message: 'افزودن شماره تماس جدید',
      acceptLabel: 'ثبت',
      rejectLabel: 'انصراف',
      icon: 'pi pi-exclamation-circle',
      acceptIcon: 'pi pi-check ml-1',
      rejectIcon: 'pi pi-times ml-1',
      rejectButtonStyleClass: 'p-button-danger p-button-sm',
      acceptButtonStyleClass: 'p-button-success p-button-sm mr-1',
      accept: () => {
        this.loading.show();
        const input = {
          customerId: this.workItem.customer.id,
          title: this.newTitlePhoneNumber,
          phoneNumber: this.newPhoneNumber
        }
        this.service.postNewCustomerPhone(input).subscribe({
          next: (out) => {
            this.loading.hide();
            this.newTitlePhoneNumber = null;
            this.newPhoneNumber = null;
            this.getWorkItem();
          },
          error: (err) =>{
            this.loading.hide();
          }
        })
      }
    })
  }

  backLocation(){
    this.location.back();
  }

  @ViewChild('stepperContainer', { static: false }) stepperContainer!: ElementRef;

  scrollStepper(direction: 'left' | 'right') {
    const container = this.stepperContainer.nativeElement;
    const scrollAmount = 200;

    if (direction === 'left') {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  }



}

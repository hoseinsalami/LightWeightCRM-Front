import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener, input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {DividerModule} from "primeng/divider";
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {InputTextModule} from "primeng/inputtext";
import {IActiveDate, NgPersianDatepickerComponent, NgPersianDatepickerModule} from "ng-persian-datepicker";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AutoComplete, AutoCompleteCompleteEvent, AutoCompleteModule} from "primeng/autocomplete";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from "primeng/checkbox";
import {AccordionModule} from "primeng/accordion";
import {
  CreateCustomerPhone,
  CreateWorkItemType,
  CustomerSpecification,
  WorkItemType
} from "./_types/create-work-item.type";
import {PathService} from "./path.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {StepType} from "./_types/path-work-items-detail.type";
import {LoadingService} from "../_services/loading.service";
import {ConfirmationService, SharedModule} from "primeng/api";
import {JalaliDatePipe} from "../_pipes/jalali.date.pipe";
import {CdkDrag, CdkDragDrop, CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";
import {WorkItemService} from "../work-item/work-item.service";
import {CustomMessageService} from "../_services/custom-message.service";
import {KeyFilterModule} from "primeng/keyfilter";
import {Utilities} from "../_classes/utilities";
import {WorkItemStatesEnum, WorkItemStatesEnum2LabelMapping} from "./_enums/work-item-states.enum";
import {RippleModule} from "primeng/ripple";
import {UserTypeBase} from "../setting/_types/user.type";
import {DropdownChangeEvent, DropdownModule} from "primeng/dropdown";
import {distinctUntilChanged, take} from "rxjs/operators";
import {AuthenticationService} from "../_services/authentication.service";
import {LoginOutputSscrmType} from "../_types/login-output.type";
import {UserTypesEnum} from "../_enums/user-types.enum";
import {TooltipModule} from "primeng/tooltip";
import {TimeUnitsEnum, TimeUnitsEnum2LabelMapping} from "../_enums/TimeUnits.enum";
import {CreatePathType, CreateStepType, UpdatePathType} from "../setting/_types/createPath.type";
import {Directionality} from "@angular/cdk/bidi";
import {DashboardService} from "../_services/dashboard.service";
import {DashboardTypeBase} from "../_types/dashboard.output.type";
import {CariesService} from "../setting/_services/caries.service";
import {MultiSelectModule} from "primeng/multiselect";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {debounceTime} from "rxjs";
import {SendMessageType} from "./_types/send-message.type";
import {AccustomType} from "../setting/_types/accustom.type";
import {CustomerService} from "../setting/_services/customer.service";
import {FieldsetModule} from "primeng/fieldset";

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrl: './path.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    DividerModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    NgPersianDatepickerModule,
    ReactiveFormsModule,
    FormsModule,
    AutoCompleteModule,
    ButtonModule,
    CheckboxModule,
    AccordionModule,
    SharedModule,
    RouterLink,
    JalaliDatePipe,
    CdkDropList,
    CdkDrag,
    DragDropModule,
    KeyFilterModule,
    RippleModule,
    DropdownModule,
    TooltipModule,
    MultiSelectModule,
    OverlayPanelModule,
    FieldsetModule
  ],
  providers:[JalaliDatePipe]
})
export class PathComponent implements OnInit, AfterViewInit{

  @ViewChild('datePicker') datePicker:NgPersianDatepickerComponent;
  @ViewChild('scrollableElement')  scrollableElement!: ElementRef;
  @ViewChild('customerNameInput') customerNameInput!: ElementRef<HTMLInputElement>;

  paginationData: { [stepId: string]: { from: number; rows: number; isLoading:boolean, hasMore:boolean } } = {};
  workItems?: CreateWorkItemType = new CreateWorkItemType({})
  steps?: StepType[];
  // stepOfWorkItems?: WorkItemType[];
  adminUsers: UserTypeBase[]
  pathExpertUsers?: UserTypeBase[];
  cariesExpertUsers?: UserTypeBase[];
  workItemId: string;
  startDate!: string;
  startDateTimeControl = new FormControl()
  filteredCustomer: CustomerSpecification[];
  filteredWorkItem: any;
  selectedCustomer: CustomerSpecification | null = null;
  selectedCountryAdvanced: any;

  isRequired:boolean = true
  showModal: boolean = false;
  showModalSearchWorkItem:boolean = false;
  showCustomerForm:boolean = false;
  selectedWorkItem: any = null

  pathId = null;
  user:LoginOutputSscrmType|undefined = undefined;
  protected readonly UserTypesEnum = UserTypesEnum

  connectedDropLists: any = [];
  workItemStatesEnum:any
  selectedExpertUser:any

  @ViewChildren('card') cards!: QueryList<ElementRef>;
  @ViewChildren('column') columns!: QueryList<ElementRef>;
  @ViewChild('headerSteps') headerSteps!: ElementRef;
  @ViewChild('bodyWrapper') bodyWrapper!: ElementRef;
  @ViewChild('autoComplete') autoComplete!: AutoComplete;
  @ViewChildren('stepColumn', { read: ElementRef }) stepColumns!: QueryList<ElementRef>;
  lastCardBottom = 0
  showScrollButtons: boolean = false;

  // modal caries
  showModalCariesStep:boolean = false
  showModalDetailCaries:boolean = false
  TimeUnits?: any;
  // orderList?: CreateStepType[] = [];
  orderList?: CreateStepType = new CreateStepType({});
  listOfCaries:DashboardTypeBase;
  detailCaries?:CreatePathType = new CreatePathType({});

  accustom : AccustomType[] = [];

  showListPhoneNumber?:number | null = null;
  constructor(
    private service: PathService,
    private workItemService: WorkItemService,
    private customerServices: CustomerService,
    private messagesService: CustomMessageService,
    private confirmationService: ConfirmationService,
    private activeRoute: ActivatedRoute,
    private loading: LoadingService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService:AuthenticationService,
    private dir: Directionality,
    private dashboardService: DashboardService,
    private cariesService: CariesService
  ) {
    this.workItemStatesEnum = Utilities.ConvertEnumToKeyPairArray(WorkItemStatesEnum, WorkItemStatesEnum2LabelMapping)
    this.TimeUnits = Utilities.ConvertEnumToKeyPairArray(TimeUnitsEnum,TimeUnitsEnum2LabelMapping)

    authService.token?.pipe(take(1)).subscribe(token => {
      this.user = token
    });

    this.activeRoute.params.subscribe(res => {
      if (res['id']){
        this.pathId = +res['id']
        this.service.setPathId(this.pathId);
        localStorage.setItem('pathId', this.pathId)
        this.getListOfSteps();
        this.getListOfExpertUsers();
        if (this.pathId) this.getListOfPath()
      }
    });

  }

  ngOnInit() {
    // this.onGetWorkItemsTask()

  }

  ngAfterViewInit() {
    if (!this.isRequired && this.datePicker) {
      this.datePicker.setSelectedDate(null);
      this.startDate = null;
      this.startDateTimeControl.disable();
      this.startDateTimeControl.setValue(null);
    }
    this.connectedDropLists = this.steps.map(step => 'dropList-' + step.id);
  }


  getListOfPath(){
    this.dashboardService.dashboard$.subscribe({
      next: (data) =>{
        this.listOfCaries = data
        if (+this.pathId && this.listOfCaries?.otherPaths.some(p => p.id == +this.pathId)) {
          this.pathId = this.pathId;
        }
      },
    })
  }

  getListOfSteps(){
    this.loading.show();
    this.service.getListOfStep(this.pathId).subscribe(res =>{
      this.loading.hide()
      this.steps = res

      this.connectedDropLists = this.steps.map(step => 'dropList-' + step.id);
      this.steps.forEach((step) => {
        // this.stepOfWorkItems = []

        this.paginationData[step.id] = {
          from: 0,
          rows: 20,
          isLoading: false,
          hasMore: true
        };
        this.loadMoreWorkItems(step.id);

      });



    }, error => {
      this.loading.hide()
    })
  }

  getListOfExpertUsers(){
    this.loading.show();
    this.service.listOfExpertUsers(this.pathId).subscribe((res) => {
      this.loading.hide();
      this.pathExpertUsers = res;
    }, error => {
      this.loading.hide()
    })
  }

  getListOfAccustom(){
    this.loading.show();
    this.customerServices.getAccustom().subscribe((res) => {
      this.loading.hide();
      this.accustom = res;
    }, error => {
      this.loading.hide();
    })
  }


  isSticky = false
  isDragging: boolean = false;
  scrollLoadings:boolean = false;
  // @HostListener('window:scroll',[])
  // onScroll(){
  //   const headerHeight = 7; // Height of your header in vh
  //   const scrollTop = window.scrollY;
  //   this.isSticky = scrollTop > headerHeight * window.innerHeight / 100;
  //
  //   if (!this.isDragging && !this.scrollLoadings && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
  //     this.scrollLoadings = true;
  //     this.loadMoreWorkItems();
  //   }
  //
  // }

  scrollAmount = 300;
  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (event.shiftKey) { // اگر دکمه Shift گرفته شده باشد
      event.preventDefault(); // جلوگیری از اسکرول عمودی
      const scrollDirection = event.deltaY > 0 ? this.scrollAmount : -this.scrollAmount;

      if (this.headerSteps && this.bodyWrapper) {
        this.headerSteps.nativeElement.scrollLeft += scrollDirection;
        this.bodyWrapper.nativeElement.scrollLeft += scrollDirection;
      }
    }
  }


  loadMoreWorkItems(stepId:any) {
    const step = this.steps.find(s => s.id === stepId);
    if (!step) return;

    if (!this.paginationData[stepId]) {
      this.paginationData[stepId] = { from: 0, rows: 20, isLoading: false, hasMore: true };
    }


    const pagination = this.paginationData[stepId];
    if (pagination.isLoading || !pagination.hasMore) {
      return;
    }

    pagination.isLoading = true;
    this.loading.show();
    this.service.getListOfWorkItem(stepId, pagination.from, pagination.rows).subscribe(res => {
      step.workItems = [...(step.workItems || []), ...res];
      pagination.from += res.length;

      if (res.length < pagination.rows) {
        pagination.hasMore = false;
      }

      pagination.isLoading = false;
      this.scrollLoadings = false;
      this.loading.hide();
    }, err => {
      pagination.isLoading = false;
      this.scrollLoadings = false;
      this.loading.hide();
    });

    // this.steps.forEach(step =>{
    //
    //   if (!this.paginationData[step.id]) {
    //     this.paginationData[step.id] = { from: 0, rows: 20,isLoading:false  };
    //   }
    //   const pagination = this.paginationData[step.id]
    //
    //   if (!pagination.isLoading){
    //     pagination.isLoading=true;
    //     this.loading.show()
    //     this.service.getListOfWorkItem(step.id,pagination.from,pagination.rows).subscribe(res =>{
    //       step.workItems = [...step.workItems , ...res];
    //       pagination.from += res.length
    //       this.loading.hide();
    //       pagination.isLoading=false;
    //       this.scrollLoadings = false; // Reset only when all calls are complete
    //       this.loading.hide();
    //     }, error => {
    //       this.loading.hide()
    //       pagination.isLoading=false;
    //       this.scrollLoadings = false; // Reset only when all calls are complete
    //       this.loading.hide();
    //     })
    //
    //   } else {
    //       this.scrollLoadings = false; // Reset only when all calls are complete
    //       this.loading.hide();
    //   }
    //
    // })

  }

  onStepScroll(event: any) {
    const el = event.target;

    // وقتی به انتهای اسکرول رسید
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      for (const step of this.steps) {
        const pagination = this.paginationData[step.id];
        if (!pagination?.isLoading && pagination?.hasMore) {
          this.loadMoreWorkItems(step.id);
        }
      }
    }
  }

  onRegister(){

    if (this.showCustomerForm){
      if (!this.workItems.customer.name){
        return this.messagesService.showError('نام مشتری اجباری می باشد.')
      }
      if (!this.workItems.customer.family){
        return this.messagesService.showError('نام خانوادگی مشتری اجباری می باشد.')
      }
      if (!this.workItems.customer.phone && !this.workItems.customer.mobile){
        return this.messagesService.showError('حداقل یکی از شماره همراه یا ثابت باید وارد شود.')
      }
      // if (this.workItems.customer.companyName === undefined || this.workItems.customer.companyName == null){
      //   return this.messagesService.showError('نام شرکت اجباری می باشد.')
      // }
      if ((!/^\d{11}$/.test(this.workItems.customer.phone || '')) && (!/^\d{11}$/.test(this.workItems.customer.mobile || ''))) {
        return this.messagesService.showError('شماره تماس باید دقیقاً ۱۱ رقم باشد.');
      }

      this.workItems.customer.fullName = `${this.workItems.customer.name} ${this.workItems.customer.family}`;
      this.selectedCustomer = this.workItems.customer;
    }
    if (!this.workItems.customerId && Object.keys(this.workItems.customer).length === 0){
      return this.messagesService.showError('مشتری اجباری می باشد.')
    }
    this.loading.show()
    this.workItems.stepId = this.selectedWorkItem;
    this.workItems.pathId = +this.pathId;
    // this.workItems.deadline = this.startDate ? this.startDate.trim()?.concat('T' + '00:00:00') : null;
    if (this.user.userType === UserTypesEnum.Expert){
      this.workItems.responsibleUserId = this.user.id
    }

    // ایجاد یک کپی برای جلوگیری از تغییر داده های اصلی
    let x = JSON.stringify(this.workItems)
    const input = JSON.parse(x)
    if (input.customerId){
      input.customer = null
    }
    // console.log(input)
    this.service.onCreateWorkItemTask(input).subscribe(res => {
      this.loading.hide()
      this.showModal = false
      this.filteredCustomer = [];
      input.id = res.id

      this.paginationData = {};
      this.getListOfSteps();

      this.workItems = new CreateWorkItemType({})
      this.messagesService.showSuccess('معامله با موفقیت ایجاد شد.')
    }, error => {
      this.loading.hide();
    })
  }



  selectStartDate(event: IActiveDate) {
    this.startDate = event.gregorian
  }

  initialStartDatePicker(event: IActiveDate) {
    this.startDate = event.gregorian;
  }

  filterCustomer(event: AutoCompleteCompleteEvent) {
    this.service.onSearchCustomer(event.query).subscribe(res => {
      this.filteredCustomer = res.map(customer =>({
        ...customer,
        fullName: `${customer.name} ${customer.family}`
      })) as CustomerSpecification[];
      // this.filteredCustomer = res
      // console.log(this.filteredCustomer)
    })
  }

  selectCustomer(filter: any){
    this.workItems.customerId = filter.value.id
  }

  handleClear() {
    this.workItems.customer = new  CustomerSpecification({})
    this.showCustomerForm = false;
  }

  filterWorkItems(event: AutoCompleteCompleteEvent){
    this.service.onSearchWorkItem(this.pathId,event.query).subscribe((res) => {
      this.filteredWorkItem = res
    })
  }

  selectWorkItem(filter: any){
    this.router.navigateByUrl(`/workItem/${filter.value.id}`)
  }

  onCheckboxChange() {
    if (!this.isRequired) {
      this.startDateTimeControl.disable();
      this.startDateTimeControl.setValue(null);
      this.startDate = null;
    } else {
      this.startDateTimeControl.enable();
    }
  }

  navigateToWorkItem(id) {
    this.router.navigate(['dashboard/workItem/', id])
  }

  navigateToConfig(item){
    this.router.navigate(['setting/caries/config', this.pathId, item.id])
  }

  openModal(id:number) {
    this.showModal = true;
    this.selectedWorkItem = id
    this.workItems = new CreateWorkItemType({})
    this.workItems.customer = new CustomerSpecification({})
    this.selectedCustomer = null;
  }

  openModalNewCustomer(){
    this.showCustomerForm = true;
    this.getListOfAccustom();
    if (this.autoComplete && this.autoComplete.overlayVisible) {
      this.autoComplete.hide();
    }
    setTimeout(() => {
      this.customerNameInput?.nativeElement.focus();
    });
  }

  closeModal(){
    this.showModal = false;
    this.selectedWorkItem = null;
    this.handleClear()
  }


  drop(event: CdkDragDrop<any[]> , targetStepId: number) {

    this.confirmationService.confirm({
      header: 'تغییر گام قلم کاری',
      message: 'آیا از تغییر گام قلم کاری مطمئن هستید؟',

      accept: () => {
        const previousContainerData = event.previousContainer.data;
        const containerData = event.container.data;

        if (event.previousContainer !== event.container) {
          // Get the moved item
          // const movedItem = previousContainerData.splice(event.previousIndex, 1)[0];
          const movedItem = previousContainerData.splice(event.previousIndex, 1)[0];
          // Add the moved item to the target step
          // containerData.splice(event.currentIndex, 0, movedItem);
          // Call the service to update the backend
          this.loading.show();
          const input = {workItemId : movedItem.id, stepId : targetStepId}
          this.workItemService.onChangeStatusSteps(input).subscribe((res) => {
            this.loading.hide();
            this.paginationData[input.stepId] = {
              from: 0,
              rows: 20,
              isLoading: false,
              hasMore: true
            };
            const step = this.steps.find(s => s.id === input.stepId);
            if (step) {
              step.workItems= []
              this.loadMoreWorkItems(input.stepId);
            }
            this.messagesService.showSuccess('عملیات با موفقیت انجام شد.');

          }, error => {
            this.loading.hide();
            console.error('Error moving item', error);
            // Revert changes in the UI if the API call fails
            // previousContainerData.splice(event.previousIndex, 0, movedItem);
            // containerData.splice(event.currentIndex, 1);
          });
          console.log(input , movedItem , event.previousIndex, targetStepId)
        }
      },
    });




    // if (event.previousContainer !== event.container) {
    //   // Move item from one list to another
    //   const previousContainerData = event.previousContainer.data;
    //   const containerData = event.container.data;
    //
    //   // Remove the dragged item from the source array
    //   const movedItem = previousContainerData.splice(event.previousIndex, 1)[0];
    //
    //   // Add the item at a specific position (e.g., the second position)
    //   const targetIndex = 1; // Change this to the desired index
    //   containerData.splice(targetIndex, 0, movedItem);
    // } else {
    //   // Reorder within the same list
    //   const containerData = event.container.data;
    //   const previousIndex = event.previousIndex;
    //   const currentIndex = event.currentIndex;
    //
    //   const movedItem = containerData.splice(previousIndex, 1)[0];
    //   containerData.splice(currentIndex, 0, movedItem);
    // }
  }


  onDragStarted() {
    this.isDragging = true;
  }

  onDragEnded() {
    this.isDragging = false;
  }

  dropStep(event: CdkDragDrop<any[]>){
    this.confirmationService.confirm({
      header: 'تغییر گام',
      message: 'آیا از تغییر گام مطمئن هستید؟',

      accept: () => {

        const isRtl = (this.dir && this.dir.value === 'rtl')
          || getComputedStyle(this.headerSteps.nativeElement).direction === 'rtl'
          || document.dir === 'rtl';

        let prev = event.previousIndex;
        let curr = event.currentIndex;

        if (isRtl) {
          const len = this.steps.length;
          // نگاشت اندیس بصری -> اندیس منطقی آرایه
          prev = len - 1 - prev;
          curr = len - 1 - curr;
          const draggedItem = event.item.data;
          const draggedId = draggedItem.id;
          // console.log(prev , curr, draggedItem , draggedId)

          this.loading.show();
          const input = {
            stepId: draggedId,
            pathId: +this.pathId,
            newOrder:  curr +1
          }
          this.service.changeOrderStep(input).subscribe({
            next: (out) => {
              this.loading.hide();
              this.getListOfSteps();
            },
            error: err => {
              this.loading.hide();
            }
          })

        }

      }
    });



    console.log(event)
  }

  scroll(direction: 'left' | 'right') {
    const offset = direction === 'left' ? -300 : 300;

    [this.headerSteps, this.bodyWrapper].forEach((el) => {
      el?.nativeElement.scrollBy({ left: offset, behavior: 'smooth' });
    });
  }

  // دکمه (space) توسط (p-orderlist) رزرو شده است لذا برای ایجاد فاصله در اینپونت از این تابع استفاده میشود
  protected handleSpace(event: KeyboardEvent) {
    if (event.code === 'Space'){
      event.stopPropagation();
    }
  }

  orderStep:number = 0
  modeCaries: 'new' | 'edit' = "new";
  openModalNewCaries(event:any){
    this.showModalCariesStep = true
    this.modeCaries = "new"
    this.orderStep = event.order
    // this.orderList = [new CreateStepType({})]
    this.orderList = new CreateStepType({})
  }

  openModalEditCaries(event:any){
    this.loading.show()
    this.service.getInfoStep(event.id).subscribe({
      next: (out) =>{
        this.loading.hide();
        // this.orderList = [out]
        this.orderList = out
        this.showModalCariesStep = true;
        this.modeCaries = "edit"
      },
      error: err => {
        this.loading.hide();
      }
    })
  }

  onAddNewStep(){
    console.log(this.orderList)
    const input ={
      pathId: this.pathId,
      // title: this.orderList[0].title,
      title: this.orderList.title,
      order: this.orderStep,
      // deadlineValue: this.orderList[0].deadlineValue
      deadlineValue: this.orderList.deadlineValue
    }
    this.loading.show()
    this.service.addStep(input).subscribe({
      next: (out) =>{
        this.loading.hide()
        this.showModalCariesStep = false;
        this.messagesService.showSuccess('عملیات با موفقیت انجام شد');
        this.getListOfSteps();
      },
      error: err => {
        this.loading.hide()
      }
    })
  }

  onEditStep(){
    this.loading.show();
    this.service.editStep(this.orderList).subscribe({
      next: (out) =>{
        this.loading.hide();
        this.showModalCariesStep = false;
        this.messagesService.showSuccess('عملیات با موفقیت انجام شد');
        this.getListOfSteps();
      },
      error: err => {
        this.loading.hide();
      }

    })
  }


  getListOfUserAdmins() {
    this.loading.show()
    this.cariesService.listOfUserAdmins().subscribe((res) =>{
      this.loading.hide()
      this.adminUsers = res;
    }, error => {
      this.loading.hide();
    })
  }

  getListOfUserExperts() {
    this.loading.show()
    this.cariesService.listOfUserExperts().subscribe((res) =>{
      this.loading.hide();
      this.cariesExpertUsers = res

    }, error => {
      this.loading.hide();
    })
  }

  modalDetailCaries(){
    this.loading.show()
    this.cariesService.onEditPath(this.pathId).subscribe({
      next: (out) => {
        this.loading.hide();
        this.showModalDetailCaries = true;
        let temp = new UpdatePathType(out);
        temp.pathExpertIds = out.pathExperts.map(e => e.id)
        temp.pathAdminId = out.pathAdmin?.id
        this.detailCaries = temp
        this.getListOfUserAdmins()
        this.getListOfUserExperts()

      },
      error: err => {
        this.loading.hide()
      }
    })
  }

  // ویراش کاریز
  onUpdateCaries(){
    this.loading.show();
    this.service.onUpdateCaries(this.detailCaries.id, this.detailCaries).subscribe({
      next: (out) =>{
        this.loading.hide();
        this.dashboardService.loadDashboard();
        this.showModalDetailCaries= false;
      },
      error: err => {
        this.loading.hide();
      }
    })
  }

  navigatePath(event: DropdownChangeEvent) {
    this.router.navigate([`/path/${event.value}`]);
  }


  showListPhoneNumberFor: number | null = null;
  selectedPhonesMap: { [id: number]: string } = {};

  onMouseEnter(workItemId: number) {
    this.showListPhoneNumberFor = workItemId;
  }

  togglePhoneNumber(event:any, workItem:any){
    const phones = this.getFilteredPhones(workItem);

    if (!phones || phones.length === 0) {
      return; // ❌ Overlay باز نشود
    }
  }
  getSelectedPhone(workItem: any): string {
    if (!workItem?.customer?.customerPhones?.length) return '';

    // شماره پیش‌فرض (isDefault=true)
    const defaultPhoneObj = workItem.customer.customerPhones.find((p: any) => p.isDefault);

    // اگر کاربر شماره‌ای انتخاب کرده بود، اون رو نشون بده؛
    // در غیر این صورت شماره پیش‌فرض؛ و اگه اونم نبود، اولین شماره
    return (
      this.selectedPhonesMap[workItem.id] ||
      defaultPhoneObj?.phoneNumber ||
      workItem.customer.customerPhones[0].phoneNumber
    );
  }

  getFilteredPhones(workItem: any) {
    const selected = this.getSelectedPhone(workItem);
    return workItem.customer?.customerPhones?.filter(
      (p: any) => p.phoneNumber !== selected
    ) || [];
  }

  selectPhone(workItem: any, phoneNumber: CreateCustomerPhone) {
    this.selectedPhonesMap[workItem.id] = phoneNumber.phoneNumber;
    this.showListPhoneNumberFor = null;

    const input = {
      customerId: workItem.customer.id,
      customerPhoneId: phoneNumber.id
    }

    // console.log(workItem , phoneNumber, input)
    this.loading.show();
    this.service.onChangeDefaultPhone(workItem.customer.id, input).subscribe({
      next: (out) => {
        this.loading.hide();
        this.messagesService.showSuccess('عملیات با موفقیت ایجاد شد.')
      },
      error: (err) =>{
        this.loading.hide();
      }
    })

  }

  showDialogSms:boolean = false
  dataMessage:SendMessageType = {}
  openDialogSms(item){
    this.showDialogSms = true
    this.dataMessage = {}
    this.dataMessage.platform = 0
    this.dataMessage.phoneNumber = this.getSelectedPhone(item);
    this.dataMessage.workItemId = item.id;
    this.dataMessage.customerId = item?.customer?.id;
    this.dataMessage.sendDateTime = null;
  }

  onSendMessage(){
    console.log(this.dataMessage)
    this.loading.show();
    this.service.sendMessage(this.dataMessage).subscribe({
      next: (out) => {
        this.loading.hide();
        this.messagesService.showSuccess('عملیات با موفقیت انجام شد.');
        this.showDialogSms = false;
      },
      error: (err) => {
        this.loading.hide();
        this.showDialogSms = true;
      }
    })
  }


}

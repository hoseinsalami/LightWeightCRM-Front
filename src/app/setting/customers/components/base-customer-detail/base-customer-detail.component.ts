import {BaseListComponent} from "../../../../shared/base-list/base-list.component";
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {CariesService} from "../../../_services/caries.service";
import {LoadingService} from "../../../../_services/loading.service";
import {CustomerService} from "../../../_services/customer.service";
import {CreateCustomerPhone, CustomerSpecification, WorkItemType} from "../../../../path/_types/create-work-item.type";
import {ActivityType} from "../../../_types/activity.type";
import {UserTypeBase} from "../../../_types/user.type";
import {FormControl} from "@angular/forms";
import {CreateActivityType} from "../../../../_types/create-activity.type";
import {ActivityWorkItemType} from "../../../../work-item/_types/activity-workItem.type";
import {WorkItemService} from "../../../../work-item/work-item.service";
import {AutoCompleteCompleteEvent} from "primeng/autocomplete";
import {IActiveDate, NgPersianDatepickerComponent} from "ng-persian-datepicker";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {MessageService} from "primeng/api";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {AccustomType} from "../../../_types/accustom.type";
import {Location} from "@angular/common";
import {Utilities} from "../../../../_classes/utilities";
import {TicketTypeEnum, TicketTypeEnum2LabelMapping} from "../../../../_enums/ticket-type.enum";
import {TagTypeBase} from "../../../_types/tag.type";
import {OverlayPanel} from "primeng/overlaypanel";
import * as moment from 'jalali-moment';
import {Jalali} from "jalali-ts";
import {Component, ViewChild} from "@angular/core";

@Component({
  template:''
})

export class BaseCustomerDetailComponent{

  birthDate!: string;
  birthDateJson!: string;
  birthDateTimeControl = new FormControl(null)
  birthDateJsonTimeControl = new FormControl(null)
  customerId:string;
  accustom : AccustomType[] = [];
  filteredCustomer: CustomerSpecification[] = [];
  customerJson:any;
  optionalLabel = [
    {title:'جناب آقای'},
    {title:'سرکار خانم'},
    {title:'ریاست محترم'},
    {title:'مدیر محترم'},
    {title:'مهندس'},
    {title:'دکتر'},
  ]

  showModalWorkItem:boolean = false
  showModalBranches:boolean = false

  ticketType:any;
  protected readonly TicketTypeEnum2LabelMapping = TicketTypeEnum2LabelMapping
  protected listOfTag:TagTypeBase[] = [];
  protected selectedTags: any[] = [];

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
  constructor(protected manager: BaseSaveManager<CustomerSpecification>,
              private customerServices: CustomerService,
              private workItemService: WorkItemService,
              protected loading: LoadingService,
              private sanitizer:DomSanitizer,
              private messagesService: CustomMessageService,
              private activeRouted: ActivatedRoute,
              private location: Location) {
    this.ticketType = Utilities.ConvertEnumToKeyPairArray(TicketTypeEnum,TicketTypeEnum2LabelMapping)

    this.activeRouted.params.subscribe((res) =>{
      if (res['id']){
        this.customerId = res['id']
      }
    })
    this.getListOfAccustom()
    this.getListOfTag();

    this.birthDateTimeControl.setValue(null);
    this.birthDateJsonTimeControl.setValue(null);
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

  getInfoCustomer(){
    this.loading.show();
    this.customerServices.getCustomerDetail(+this.customerId).subscribe((res) =>{
      this.loading.hide()
      this.manager.oneObject = new CustomerSpecification(res)//(res as any )
    }, error => {
      this.loading.hide();
    })
  }

  onEditCustomer(){
    this.loading.show();
    this.manager.oneObject = this.customerJson
    this.manager.oneObject.customerPhones = this.customerJson.customerPhones.filter(phone => phone.title.trim() !== '' && phone.phoneNumber.trim() !== '');
    this.manager.oneObject.birthdate = this.birthDateJson ? this.birthDateJson.trim().concat('T' + '00:00:00') : null
    this.customerServices.onUpdateCustomer(+this.customerId , this.manager.oneObject as CustomerSpecification).subscribe((res) => {
      this.loading.hide()
      this.showCustomerModal = false;
      this.messagesService.showSuccess('عملیات با موفقیت انجام شد.');
      this.getInfoCustomer()
    }, error => {
      this.loading.hide();
    })
  }

  getListOfTag(){
    this.loading.show();
    this.customerServices.getTagsWorkItem().subscribe({
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
    this.loading.show();
    const input = {
      tagId:tag.id,
      customerId: +this.customerId
    }
    this.customerServices.onAssignTag(input).subscribe({
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
      customerId: +this.customerId
    }
    this.customerServices.deleteTag(input).subscribe({
      next: (out) => {
        this.loading.hide();
        this.selectedTags = this.selectedTags.filter(t => t !== tag)
      },
      error: (err) =>{
        this.loading.hide()
      }
    })
  }

  showCustomerModal:boolean = false;
  @ViewChild('datePicker') datePicker!: NgPersianDatepickerComponent;
  onOpenCustomerModal(){
    this.customerJson = structuredClone(this.manager.oneObject)
    console.log(this.customerJson)

    // نمایش تاریخ
    setTimeout(() => {
      if (!this.datePicker) return;
      const isoDate = this.customerJson.birthdate.split('T')[0]; // "2025-10-23"
      const m = (moment as any)(isoDate, 'YYYY-MM-DD');
      const jalaliDate = new Jalali(new Date(m.year(), m.month(), m.date()));
      this.datePicker.changeSelectedDate(jalaliDate as any, true);
    });

    if (!this.customerJson.customerPhones || this.customerJson.customerPhones.length === 0){
      this.customerJson.customerPhones = [{title:'', phoneNumber:''}]
    }

    if (this.customerJson.introducer.id === this.customerJson.introducerId) {
      this.filteredCustomer = [this.customerJson.introducer];
      this.customerJson.introducerId = this.customerJson.introducer.id;
    }

    this.showCustomerModal = true;
  }

  onCloseCustomerModal(){
    this.showCustomerModal = false
  }

  backLocation(){
    this.location.back()
  }


  addField(mode?:string) {

    if (mode == 'new'){
      const phones =this.manager.oneObject.customerPhones
      const lastField = phones[phones.length - 1];
      if (lastField && (!lastField.title.trim() || !lastField.phoneNumber.trim())) {
        this.messagesService.showError('لطفاً قبل از افزودن شماره جدید، شماره تماس فعلی را کامل کنید.');
        return; // جلوگیری از اضافه کردن فیلد جدید
      }
      this.manager.oneObject.customerPhones.push(
        new CreateCustomerPhone({ title: '', phoneNumber: '' })
      );
    } else {
      const phones = this.customerJson['customerPhones'];
      const lastField = phones[phones.length - 1];
      if (lastField && (!lastField.title.trim() || !lastField.phoneNumber.trim())) {
        this.messagesService.showError('لطفاً قبل از افزودن شماره جدید، شماره تماس فعلی را کامل کنید.');
        return; // جلوگیری از اضافه کردن فیلد جدید
      }


      const newFields = new CreateCustomerPhone({ title: '', phoneNumber: '' })
      if (this.customerId)
        this.customerJson['customerPhones'].push(newFields);

      // this.manager.oneObject['customerPhones'].push(newFields);
    }


  }

  protected removeField(index: number) {
    if (this.customerId)
      this.customerJson['customerPhones'].splice(index, 1);

    this.manager.oneObject['customerPhones'].splice(index, 1);
  }


  showModal(item:string){
    if (item === 'workItem') {
      this.showModalWorkItem = true;
    } else if (item === 'branches') {
      this.showModalBranches = true;
    }
  }


  selectStartDate(event: IActiveDate) {
    this.birthDate = event.gregorian
  }
  initialStartDatePicker(event: IActiveDate) {
    this.birthDateJson = event.gregorian;
  }
  selectStartDateJson(event:IActiveDate){
    this.birthDateJson = event.gregorian
  }


  filterCustomer(event: AutoCompleteCompleteEvent) {
    this.customerServices.onSearchCustomer(event.query).subscribe(res => {
      this.filteredCustomer = res.map(customer =>({
        ...customer,
        fullName: `${customer.name} ${customer.family}`
      })) as CustomerSpecification[];
    })
  }

  selectCustomer(filter: any){
    this.manager.oneObject.introducerId = filter.value.id
  }

  gregorianToJalaliDisplay(gregorianDate: string): string {
    try {
      // جدا کردن سال، ماه و روز از رشته (بدون در نظر گرفتن timezone)
      let year: number, month: number, day: number;

      // اگر format: "2025-12-22T00:00:00" است
      const datePart = gregorianDate.split('T')[0]; // "2025-12-22"
      const parts = datePart.split('-').map(Number);

      if (parts.length === 3) {
        year = parts[0];
        month = parts[1];
        day = parts[2];
      } else {
        throw new Error('Invalid date format');
      }

      // ایجاد یک Date object در timezone محلی (اما فقط برای Jalali)
      // با تنظیم ساعت به 12 ظهر برای جلوگیری از مشکلات
      const tempDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

      // استفاده از Jalali
      const jalali = new Jalali(tempDate);
      const jalaliYear = jalali.getFullYear();
      const jalaliMonth = jalali.getMonth() + 1; // 0-based to 1-based
      const jalaliDay = jalali.getDate();

      return `${jalaliYear}/${jalaliMonth.toString().padStart(2, '0')}/${jalaliDay.toString().padStart(2, '0')}`;

    }catch (error) {
      console.error('Error with format method:', error);

      // روش جایگزین
      const date = new Date(gregorianDate);
      const jalali = new Jalali(date);
      const year = jalali.getFullYear();
      const month = jalali.getMonth() + 1;
      const day = jalali.getDate();

      return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    }
  }

}

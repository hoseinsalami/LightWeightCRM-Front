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
import {IActiveDate} from "ng-persian-datepicker";
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


export class BaseCustomerDetailComponent{

  customerId:string;
  accustom : AccustomType[] = [];

  showModalTicket:boolean = false
  showModalWorkItem:boolean = false
  showModalBranches:boolean = false

  ticketType:any;
  protected readonly TicketTypeEnum2LabelMapping = TicketTypeEnum2LabelMapping
  protected listOfTag:TagTypeBase[] = [];
  protected selectedTags: any[] = [];
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
  customerJson:any;
  onOpenCustomerModal(){
    this.customerJson = structuredClone(this.manager.oneObject)
    if (!this.customerJson.customerPhones || this.customerJson.customerPhones.length === 0){
      this.customerJson.customerPhones = [{title:'', phoneNumber:''}]
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
    if (item === 'ticket') {
      this.showModalTicket = true;
    } else if (item === 'workItem') {
      this.showModalWorkItem = true;
    } else if (item === 'branches') {
      this.showModalBranches = true;
    }
  }


}

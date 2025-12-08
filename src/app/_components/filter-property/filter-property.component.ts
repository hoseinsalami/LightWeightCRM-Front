import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {IActiveDate, NgPersianDatepickerModule} from "ng-persian-datepicker";
import {ButtonModule} from "primeng/button";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Utilities} from "../../_classes/utilities";
import {AlphabetEnum, AlphabetEnum2LabelMapping} from "../../_enums/alphabet.enum";
import {Table} from "primeng/table";
import {CommonModule} from "@angular/common";
import {DividerModule} from "primeng/divider";
import {NoticeStatesEnum , NoticeStates2LabelMapping} from "../../_enums/notice-states.enum";

@Component({
  selector: 'app-filter-property',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    NgPersianDatepickerModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DividerModule
  ],
  templateUrl: './filter-property.component.html',
  styleUrl: './filter-property.component.scss'
})
export class FilterPropertyComponent {

  // ****************** begin filter *********************

  startDate!: string;
  finishDate!: string;
  startDateStatus!: string;
  finishDateStatus!: string;
  startDateTimeControl = new FormControl()
  finishDateTimeControl = new FormControl()
  startDateTimeControlStatus = new FormControl()
  finishDateTimeControlStatus = new FormControl()
  selectedNoticeStatusSearch:any;
  alphabet:any;
  noticeStates: { title:string, value:number }[];
  selectedNoticeStatus = undefined;



  selectedCreateAt:string;
  selectedOwnerFamily:string;
  selectedOwnerNationalCode:string;
  selectedOwnerMobile:string;
  selectedCarType:string;
  technicalDiagnosisCenter:string;
  selectedOfficers:string;
  selectedInspectors:string;
  selectedStatus: any;
  selectedStatusByDateTime: any;
  selectedAlphabet?:any;

  @Input() showModal: boolean = false;
  @Output() onShowModal = new EventEmitter<boolean>();
  @Input() table: Table
  @Input() optionOfficers?:any
  @Input() optionInspectors?: any
  @Input() optionNoticeState?: any
  @Input() optionNoticeStateByDateTime?: any
  @Input() plaque1?:any
  @Input() plaque2?:any
  @Input() plaque3?:any
  @Input() url?: string;
  @Output() lazyLoadData = new EventEmitter<string>;

  constructor(private cdr: ChangeDetectorRef) {
    this.alphabet = Utilities.ConvertEnumToKeyPairArray(AlphabetEnum ,AlphabetEnum2LabelMapping)
    this.noticeStates = Utilities.ConvertEnumToKeyPairArray(NoticeStatesEnum, NoticeStates2LabelMapping);
  }

  // construct(input: NoticeListType) {
  //   return new NoticeListType(input);
  // }


  // ******************************* begin Date Picker functions **************************//

  initialStartDatePicker(event: IActiveDate) {
    this.startDate = event.gregorian;
    this.resetDate()
  }

  initialFinishDatePicker(event: IActiveDate) {
    this.finishDate = event.gregorian
    this.resetDate()
  }

  selectFinishDate(event: IActiveDate) {
    this.finishDate = event.gregorian
  }

  selectStartDate(event: IActiveDate) {
    this.startDate = event.gregorian
  }

  resetDate(){

    setTimeout(()=>{
      this.finishDateTimeControl.reset()
      this.startDateTimeControl.reset()
      this.startDate = null;
      this.finishDate = null;

    },100)

  }

  initialStartDatePickerStatus(event: IActiveDate) {
    this.startDateStatus = event.gregorian;
    this.resetDateStatus()
  }

  initialFinishDatePickerStatus(event: IActiveDate) {
    this.finishDateStatus = event.gregorian
    this.resetDateStatus()
  }

  selectFinishDateStatus(event: IActiveDate) {
    this.finishDateStatus = event.gregorian
  }

  selectStartDateStatus(event: IActiveDate) {
    this.startDateStatus = event.gregorian
  }

  resetDateStatus(){

    setTimeout(()=>{
      this.finishDateTimeControlStatus.reset()
      this.startDateTimeControlStatus.reset()
      this.startDateStatus = null;
      this.finishDateStatus = null;

    },100)

  }
// *************************** end Date Picker functions **************************//
  resetFilter(){
    this.selectedCreateAt = null
    this.selectedOwnerFamily = null
    this.selectedOwnerNationalCode = null
    this.selectedOwnerMobile = null
    this.selectedCarType = null
    this.technicalDiagnosisCenter = null
    this.selectedOfficers = null
    this.selectedInspectors = null
    this.selectedStatus = null
    this.plaque1 = null
    this.plaque2 = null
    this.plaque3 = null
    this.selectedAlphabet = []

  }

  advanceSearch() {
    this.table.filters['createAt'] =
      [
        {matchMode: "after", operator: "and", value: this.startDate},
        {matchMode: "before", operator: "and", value: this.finishDate}
      ];

    this.table.filters['status'] = [{matchMode: "equals", operator: "and", value: this.selectedStatus ?? null}];

    this.table.filters['ownerFamily']= [{matchMode: "contains", operator: "and", value: this.selectedOwnerFamily ?? null}]
    this.table.filters['ownerMobile' ]= [{matchMode: "contains", operator: "and", value: this.selectedOwnerMobile ?? null}]
    this.table.filters['ownerNationalCode' ]= [{matchMode: "contains", operator: "and", value: this.selectedOwnerNationalCode ?? null}]
    this.table.filters['inspector.family' ]= [{matchMode: "contains", operator: "and", value: this?.selectedInspectors ?? null}]
    this.table.filters['officer.family' ]= [{matchMode: "contains", operator: "and", value: this?.selectedOfficers ?? null}];
    this.table.filters['technicalDiagnosisCenter.title' ]= [{matchMode: "contains", operator: "and", value: this?.technicalDiagnosisCenter ?? null}];
    this.table.filters['carType.title' ]= [{matchMode: "contains", operator: "and", value: this?.selectedCarType ?? null}];

    let query='';

    if(this.plaque1 != null ||
      this.plaque2 != null ||
      this.plaque3 != null ||
      this.selectedAlphabet != null ||
      this.selectedStatus != null ||
      this.startDateStatus != null ||
      this.finishDateStatus != null){

      query='?';
      if(this.plaque3 != null)
        query += 'p1='+this.plaque3 + '&';

      if(this.plaque2 != null)
        query += 'p3='+this.plaque2 + '&';

      if(this.plaque1 != null)
        query += 'p4='+this.plaque1+ '&';

      if(this.selectedAlphabet != null)
        query += 'p2='+this.selectedAlphabet + '&';


      if (this.selectedStatusByDateTime != null){
        query += 'changeStatusState=' + this.selectedStatusByDateTime + '&';
      }

      if (this.startDateStatus != null || undefined){
        query += 'changeStatusFrom=' + this.startDateStatus + '&';
      }

      if (this.finishDateStatus != null || undefined){
        query += 'changeStatusTo=' + this.finishDateStatus + '&'
      }

    }



    this.onShowModal.emit(false)
    this.lazyLoadData.emit(query)
    // this.lazyLoadData(this.construct, this.table, {}, '/list'+query);
  }

  showDialog() {
    this.onShowModal.emit(false)
  }
}

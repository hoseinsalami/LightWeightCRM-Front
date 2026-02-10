import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {CariesService} from "../../../_services/caries.service";
import {AbstractControl, FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Component, ViewChild} from "@angular/core";
import {OrderList} from "primeng/orderlist";
import {Utilities} from "../../../../_classes/utilities";
import {
  PathAssignmentPoliciesEnum,
  PathAssignmentPoliciesEnum2LabelMapping
} from "../../../../_enums/path-assignment-policies.enum";
import {UserTypeBase} from "../../../_types/user.type";
import {TimeUnitsEnum, TimeUnitsEnum2LabelMapping} from "../../../../_enums/TimeUnits.enum";
import {ActivatedRoute} from "@angular/router";

@Component({
  template: ''
})

export class BaseCariesDetailComponent<T> {

  // @ViewChild('orderList') orderList: OrderList
  // showDialog = false;
  // form: FormGroup;
  // stepsArrayForm: FormArray;

  assignmentPolicy:any
  TimeUnits?: any;

  adminUsers: UserTypeBase[]
  expertUsers: UserTypeBase[]

  isId?: string;
  constructor(protected manager: BaseSaveManager<T>,
              private cariesService: CariesService,
              protected loading: LoadingService,
              protected activeRoute: ActivatedRoute) {
    this.isId = this.activeRoute.snapshot.params['id'];

    this.assignmentPolicy = Utilities.ConvertEnumToKeyPairArray(PathAssignmentPoliciesEnum, PathAssignmentPoliciesEnum2LabelMapping);
    this.TimeUnits = Utilities.ConvertEnumToKeyPairArray(TimeUnitsEnum,TimeUnitsEnum2LabelMapping)
    this.getListOfUserAdmins();
    this.getListOfUserExperts();
    // this.initialForm()
  }

  // protected initialForm() {
  //   this.form = this.fb.group({
  //     steps: this.fb.array([this.fb.control('')])
  //   });
  // }

  // protected get steps(): FormArray {
  //   return this.form.get('steps') as FormArray;
  // }

  protected onAddNewStep(){

    // this.steps.push(this.fb.control(''))
    // this.orderList.cd.detectChanges()
  }

  // protected onDeleteStep(input){
    // console.log(this.steps , index)
    // this.steps.removeAt(index)
    // this.orderList.cd.detectChanges()
  // }




  // protected updateOrderList(){
  //   this.orderList.value = this.steps.controls;
  //   this.orderList.cd.detectChanges();
  // }

  // دکمه (space) توسط (p-orderlist) رزرو شده است لذا برای ایجاد فاصله در اینپونت از این تابع استفاده میشود
  protected handleSpace(event: KeyboardEvent) {
    if (event.code === 'Space'){
      event.stopPropagation();
    }
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
      this.expertUsers = res
    }, error => {
      this.loading.hide();
    })
  }

  protected onRegister() {

  }

  protected onCancel() {

  }

}

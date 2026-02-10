import {Component, inject} from '@angular/core';
import {DocumentService} from "../../../_services/document.service";
import {LoadingService} from "../../../../_services/loading.service";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {DocumentModelType} from "../../../_types/document.type";
import {BaseDocumentDetailComponent} from "../base-document-detail/base-document-detail.component";
import {MessageService, SharedModule} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MultiSelectModule} from "primeng/multiselect";
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {PasswordModule} from "primeng/password";
import {CommonModule, NgIf} from "@angular/common";
import {DividerModule} from "primeng/divider";
import {InputSwitchModule} from "primeng/inputswitch";
import {FieldsetModule} from "primeng/fieldset";
import {KeyFilterModule} from "primeng/keyfilter";
import {NgPersianDatepickerModule} from "ng-persian-datepicker";
import moment from "jalali-moment";
import {JalaliDatePipe} from "../../../../_pipes/jalali.date.pipe";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-edit-document',
  templateUrl: '../base-document-detail/base-document-detail.component.html',
  styleUrl: './edit-document.component.scss',
  standalone: true,
  imports: [
    CardModule,
    SharedModule,
    ReactiveFormsModule,
    InputTextModule,
    ToggleButtonModule,
    FormsModule,
    MultiSelectModule,
    ButtonModule,
    DropdownModule,
    PasswordModule,
    CommonModule,
    NgIf,
    DividerModule,
    InputSwitchModule,
    FieldsetModule,
    KeyFilterModule,
    NgPersianDatepickerModule,
    JalaliDatePipe,
    TooltipModule
  ],
  providers:[JalaliDatePipe]
})
export class EditDocumentComponent extends BaseDocumentDetailComponent{

  jalaliPipe =  inject(JalaliDatePipe)
  constructor(
    private documentService: DocumentService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService,
  ) {
    let manager = new BaseEditManager<DocumentModelType,DocumentModelType>(
      DocumentModelType,
      (input) =>{
        let temp = new DocumentModelType(input);
        temp.properties?.forEach(prop =>{
          prop.descriptor = prop.descriptor ? JSON.parse(prop?.descriptor) : null;
          if(prop.propertyType === this.propertyTypeEnum.SingleSelect || prop.propertyType === this.propertyTypeEnum.MultiSelect){
            prop.value = prop.defaultValue ? JSON.parse(prop?.defaultValue) : null;
          } else {
            prop.value = prop.defaultValue ?? null;
          }

          if (prop.descriptor && Array.isArray(prop.descriptor)){
            prop.descriptor.forEach((item, index) => {
             this.parameters.push({title: item})
            })
          }

          if (prop.propertyType === this.propertyTypeEnum.Date){
            if (prop.defaultValue){
              this.startDateTimeControl.patchValue(moment(prop?.defaultValue).locale('fa').format('YYYY-MM-DD').toString());
            }

            // const formatted = this.jalaliPipe.transform(prop?.defaultValue);
          }

        })

        return temp;
      },documentService, messageService,activeRoute, router, loading)

    super(documentService,manager,loading);


    manager.BeforeSave.subscribe(item =>{
      item.properties.forEach(prop =>{
        if(prop.propertyType === this.propertyTypeEnum.SingleSelect || prop.propertyType === this.propertyTypeEnum.MultiSelect){
          prop.descriptor = JSON.stringify(this.parameters?.map(p => { return p.title}))
          prop.defaultValue = JSON.stringify(prop.value)
        }

        if (prop.propertyType === this.propertyTypeEnum.Document) {
          prop.defaultValue = null
          prop.descriptor = String(prop.descriptor)
        }


        if (prop.propertyType === this.propertyTypeEnum.Date)
          prop.defaultValue = this.startDate ? this.startDate?.trim()?.concat('T' + '00:00:00') : prop.defaultValue

      })

    })

    manager.OnSuccessfulSave.subscribe((i) => {
      router.navigate(['./'], {relativeTo: activeRoute.parent})
    });



  }

}

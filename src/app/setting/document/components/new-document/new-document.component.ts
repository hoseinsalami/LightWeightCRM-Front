import { Component } from '@angular/core';
import {DocumentService} from "../../../_services/document.service";
import {LoadingService} from "../../../../_services/loading.service";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {BaseDocumentDetailComponent} from "../base-document-detail/base-document-detail.component";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {CreatePropertyDTO, DocumentModelType} from "../../../_types/document.type";
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
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-new-document',
  templateUrl: '../base-document-detail/base-document-detail.component.html',
  styleUrl: './new-document.component.scss',
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
    TooltipModule
  ]
})
export class NewDocumentComponent extends BaseDocumentDetailComponent{

  constructor(
    private documentService: DocumentService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService,
  ) {
    let manager = new BaseNewManager<DocumentModelType>(DocumentModelType, documentService, messageService,{}, router, activeRoute, loading);
    super(documentService,manager, loading);

    manager.oneObject.properties = [new CreatePropertyDTO({})]

    manager.BeforeSave.subscribe(item =>{
      item.properties.forEach(prop =>{
        if(prop.propertyType === this.propertyTypeEnum.SingleSelect || prop.propertyType === this.propertyTypeEnum.MultiSelect){
          prop.descriptor = JSON.stringify(this.parameters?.map(p => p.title))
          prop.defaultValue = JSON.stringify(prop.defaultValue)
        }

        if (prop.propertyType === this.propertyTypeEnum.Date)
          prop.defaultValue = this.startDate ? this.startDate?.trim()?.concat('T' + '00:00:00') : null

        if (prop.propertyType === this.propertyTypeEnum.Document)
          prop.descriptor = String(prop.descriptor)

      })
    })

    manager.OnSuccessfulSave.subscribe((i) => {
      router.navigate(['./'], {relativeTo: activeRoute.parent})
    });

  }

}

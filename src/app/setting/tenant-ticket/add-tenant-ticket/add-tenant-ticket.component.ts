import { Component } from '@angular/core';
import {TenantTicketService} from "../../_services/tenant-ticket.service";
import {LoadingService} from "../../../_services/loading.service";
import {CreateTenantTicketDTO} from "../../_types/createTenantTicketDTO";
import {environment} from "../../../../environments/environment";
import {SharedModule} from "primeng/api";
import {CommonModule, NgFor, NgIf} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DropdownModule} from "primeng/dropdown";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {StepperModule} from "primeng/stepper";
import {PanelModule} from "primeng/panel";
import {MenuModule} from "primeng/menu";
import {InputTextModule} from "primeng/inputtext";
import {NgPersianDatepickerModule} from "ng-persian-datepicker";
import {KeyFilterModule} from "primeng/keyfilter";
import {AutoCompleteModule} from "primeng/autocomplete";
import {InputTextareaModule} from "primeng/inputtextarea";
import {EditorModule} from "primeng/editor";
import {DialogModule} from "primeng/dialog";
import {JalaliDatePipe} from "../../../_pipes/jalali.date.pipe";
import {FileUploadModule} from "primeng/fileupload";
import {UploadFileComponent} from "../../../_components/upload-file/upload-file.component";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {AccordionModule} from "primeng/accordion";
import {TooltipModule} from "primeng/tooltip";
import {BadgeModule} from "primeng/badge";

@Component({
  selector: 'app-add-tenant-ticket',
  templateUrl: './add-tenant-ticket.component.html',
  styleUrl: './add-tenant-ticket.component.scss',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    RouterLink,
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
    BadgeModule,
  ]
})
export class AddTenantTicketComponent {

  oneObject: CreateTenantTicketDTO = new CreateTenantTicketDTO({});
  urlFile = []
  uploadUrl = environment.apiUrl + 'Media/TicketAttachments/Upload'

  constructor(
    private tenantTicketService: TenantTicketService,
    private loading: LoadingService,
    private router: Router,
    private activeRoute: ActivatedRoute

  ) {
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

    // this.cdRef.detectChanges();
    // console.log(this.urlFile);
  }

  onSubmit(){
    this.loading.show();
    this.oneObject.attachments = this.urlFile.length > 0 ? this.urlFile.map(item => {return item.fileName}) : null
    this.tenantTicketService.onSave(this.oneObject).subscribe({
      next: (out) =>{
        this.loading.hide();
        this.router.navigate(['./'], {relativeTo: this.activeRoute.parent})
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  cancel(){
    this.router.navigate(['./'], {relativeTo: this.activeRoute.parent})
  }


  uploadFile(event:any){
    console.log(event)
  }


}

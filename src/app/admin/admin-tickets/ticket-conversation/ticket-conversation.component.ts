import {Component, OnInit} from '@angular/core';
import {HttpResponse} from "@angular/common/http";
import {LoadingService} from "../../../_services/loading.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CustomMessageService} from "../../../_services/custom-message.service";
import {AdminTicketService} from "../admin-ticket.service";
import {EditTenantTicketDTO} from "../../../setting/_types/createTenantTicketDTO";
import {environment} from "../../../../environments/environment";
import {SharedModule} from "primeng/api";
import {CommonModule, NgFor, NgIf} from "@angular/common";
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
  selector: 'app-ticket-conversation',
  templateUrl: './ticket-conversation.component.html',
  styleUrl: './ticket-conversation.component.scss',
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
    BadgeModule
  ]
})
export class TicketConversationComponent implements OnInit{

  showModal:boolean = false;
  id: number;
  conversations?: EditTenantTicketDTO = new EditTenantTicketDTO({});
  content?:string = '';
  urlFile = [];
  uploadUrl = environment.apiUrl + 'Media/TicketAttachments/Upload';
  constructor(
    private adminTicketService: AdminTicketService,
    private loading: LoadingService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private messagesService: CustomMessageService,
  ) {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((res) =>{
      if (res['id']){
        this.id = res['id']
      }
    })

    this.getDetails();
  }


  getDetails(){
    this.loading.show();
    this.adminTicketService.getOne(this.id).subscribe({
      next: (out) =>{
        this.loading.hide();
        this.conversations = out;
      },
      error: (err)=>{
        this.loading.hide();
      }
    })
  }



  sendMessage() {
    this.loading.show()
    const input = {
      tenantTicketId: this.id,
      content: this.content,
      attachments: this.urlFile.length > 0 ? this.urlFile.map(item => {return item.fileName}) : null
    }
    this.adminTicketService.onNewMessage(input).subscribe({
      next: (out) =>{
        this.loading.hide();
        this.getDetails();
        this.content = '';
      },
      error: (err) => {
        this.loading.hide();
      }
    })
  }


  changeMainPhoto(event?:any) {
    this.urlFile = event.map((file: any) => ({
      id: file.id,               // اگر قدیمی باشه
      fileName: file.fileName,   // اگر جدید باشه
      title: file.title
    }));
    console.log(this.urlFile)
    console.log(event)
  }

  removeFile(index:any){
    this.urlFile.splice(index, 1);
    console.log(this.urlFile)
  }

  onDownloadFiles(file: any) {
    this.loading.show();
    const input = {
      id: this.id,
      title: file
    }
    this.adminTicketService.onDownloadFile(input).subscribe({
      next: (response: HttpResponse<Blob>) =>{
        this.loading.hide();
        const blob = response.body!;
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        // a.download = filename; // نام فایل
        a.download = file; // نام فایل
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(objectUrl);

        this.messagesService.showSuccess('فایل با موفقیت دانلود شد.')
      },
      error: (err) =>{
        this.loading.hide();
      }
    })


  }

  onSubmitModal(){
    this.showModal = false
  }

  closeModal(){

  }

  cancel(){
    this.router.navigate(['./'], {relativeTo: this.activeRoute.parent})
  }

}

import {Component, OnInit} from '@angular/core';
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
import {TenantTicketService} from "../../_services/tenant-ticket.service";
import {LoadingService} from "../../../_services/loading.service";
import {EditTenantTicketDTO} from "../../_types/createTenantTicketDTO";
import {environment} from "../../../../environments/environment";
import {HttpResponse} from "@angular/common/http";
import {CustomMessageService} from "../../../_services/custom-message.service";

@Component({
  selector: 'app-tenant-conversation',
  templateUrl: './tenant-conversation.component.html',
  styleUrl: './tenant-conversation.component.scss',
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
export class TenantConversationComponent implements OnInit{

  showModal:boolean = false
  id: number;
  conversations?: EditTenantTicketDTO = new EditTenantTicketDTO({});
  content?:string = '';
  urlFile = []
  uploadUrl = environment.apiUrl + 'Media/TicketAttachments/Upload'
  constructor(
    private tenantTicketService: TenantTicketService,
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
    this.tenantTicketService.getOne(this.id).subscribe({
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
    this.tenantTicketService.onNewMessage(input).subscribe({
      next: (out) =>{
        this.loading.hide();
        this.getDetails()
        this.content = '';
        this.urlFile = [];
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
    this.tenantTicketService.onDownloadFile(input).subscribe({
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

  onUpload(event: any) {
    for (let fileInfo of event.originalEvent.body) {
      // ایجاد فایل جدید که فقط شامل اطلاعات موردنیاز برای ارسال به سرور است
      this.urlFile.push({
        fileName: fileInfo.fileName,
        title: fileInfo.title
      });
    }
    // this.photos.emit(this.uploadedFiles);


    // for (let file of event.files) {
    //   this.uploadedFiles.push(file);
    //   this.imagePreviews.push(this.getImagePreview(file));
    // }
    // console.log(event.originalEvent.body)
    // console.log(event)
    // this.photos.emit(event.originalEvent.body);
    // let input = {
    //   body:event.originalEvent.body,
    //   file: event.files[0]
    // }
    // this.photos.emit(input);
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

import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {environment} from "../../../environments/environment";
import {CommonModule, NgIf} from "@angular/common";
import {FileUploadModule} from "primeng/fileupload";
import {CustomMessageService} from "../../_services/custom-message.service";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [CommonModule, FileUploadModule, NgIf, ButtonModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss'
})
export class UploadFileComponent implements OnInit, OnChanges {
  @Input() multi?:boolean = false;
  @Input() isDisabled?:boolean = false;
  @Input() uploadType?:string = 'advance';
  @Input() addLabel?:string = 'بارگزاری';
  @Input() maxImageSize?:number = 1000000;
  @Input() fileType?:number = 0;
  @Input() initialAttachments = []
  @Input() url?: string = this.urlUpload()
  @Output() photos: EventEmitter<any> = new EventEmitter<any>();
  uploadedFiles: any[] = [];
  imagePreviews: string[] = [];
  // headers : HttpHeaders = new HttpHeaders();
  constructor(private messagesService: CustomMessageService,private cdRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialAttachments'] && this.initialAttachments) {
      this.uploadedFiles = [...this.initialAttachments];
      this.photos.emit(this.uploadedFiles);
      this.cdRef.detectChanges();
    }
  }

  urlUpload(): string {
    return environment.apiUrl + 'media/upload';
  }

  urlByType(fileType = this.fileType): string | null {
    switch (fileType) {
      case 0:
        return environment.apiUrl + 'media/photo/upload';
      case 1:
        return environment.apiUrl + 'media/Doc/Upload';
      case 2:
        return environment.apiUrl + 'Movie/Upload';
      default:
        return null; // مقدار پیش‌فرض
    }
  }

  onUpload(event: any) {
    // console.log(event);
    // if (this.uploadedFiles.length > 0) {
    //   this.messagesService.showError("شما قبلاً یک فایل آپلود کرده‌اید و نمی‌توانید فایل جدیدی اضافه کنید.");
    //   return;
    // }
    // for (let file of event.files) {
    //   this.uploadedFiles.push(file);
    // }


    for (let fileInfo of event.originalEvent.body) {
      // ایجاد فایل جدید که فقط شامل اطلاعات موردنیاز برای ارسال به سرور است
      this.uploadedFiles.push({
        fileName: fileInfo.fileName,
        title: fileInfo.title
      });
    }
    this.photos.emit(this.uploadedFiles);


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

  removeFile(index:any) {
    if (this.uploadedFiles.length > index) {
      this.uploadedFiles.splice(index, 1);
      this.imagePreviews.splice(index, 1);
    }
    this.photos.emit(this.uploadedFiles);
    // this.messagesService.showSuccess("تصویر حذف شد.");
  }

  getImagePreview(file:any): string {
    return file && file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
  }

  getAccept(fileType: number): string {
    switch (fileType) {
      case 0: // Images
        return "image/jpg, image/jpeg, image/png, image/apng, image/gif, image/webp, image/svg+xml";
      case 1: // Documents
        return "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case 2: // Movies
        return "video/ogg, video/webm";
      default:
        return ""; // مقدار پیش‌فرض
    }
  }

  reset() {
    this.uploadedFiles = [];
    this.imagePreviews = [];
    this.photos.emit([]);
  }

  onSelect(event: any) {
    // console.log('hello its me');

    // if (this.uploadedFiles.length > 0) {
    //   this.messagesService.showError("شما فقط می‌توانید یک فایل آپلود کنید.");
    //   event.files = []; // حذف فایل‌های انتخاب‌شده
    //   return;
    // }
    //
    // if (event.files.length > 1) {
    //   this.messagesService.showError("فقط یک فایل قابل انتخاب است.");
    //   event.files = [event.files[0]]; // فقط اولین فایل را نگه دارید
    // }

    // console.log(event);

  }
}

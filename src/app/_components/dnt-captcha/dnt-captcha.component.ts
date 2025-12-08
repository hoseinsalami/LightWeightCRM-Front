import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {DntCaptchaService} from "../../_services/dnt-captcha-service.service";
import {DntCaptchaForm} from "../../_types/dnt-captcha-form.type";
import {DntCaptchaParams} from "../../_types/dnt-captcha-params.type";

@Component({
  selector: 'app-dnt-captcha',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ReactiveFormsModule],
  providers: [DntCaptchaService],
  templateUrl: './dnt-captcha.component.html',
  styles: ['i { font-size: 1.5rem } form { width: 30%;} ']
})
export class DntCaptchaComponent implements OnInit {
  dntCaptchaService: DntCaptchaService = inject(DntCaptchaService);

  // if you are working with angular<16, remove the required property
  @Input({ required: true }) captchaForm!: FormGroup<DntCaptchaForm>;

  captchaImageUrl = '';
  ngOnInit(): void {
    this.loadNewCaptcha();
  }

  loadNewCaptcha(): void {
    this.dntCaptchaService.getDntCaptchaParams().subscribe((data: DntCaptchaParams) => {
      this.captchaImageUrl = data.dntCaptchaImgUrl;
      this.captchaForm.reset({
        dntCaptchaText: data.dntCaptchaTextValue,
        dntCaptchaToken: data.dntCaptchaTokenValue,
        dntCaptchaInputText: ''
      });
    });
  }
}

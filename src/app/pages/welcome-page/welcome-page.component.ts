import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../_services/authentication.service";
import {ButtonModule} from "primeng/button";
import {CommonModule, NgIf} from "@angular/common";
import {CaptchaOutputType} from "../../_types/captcha-output.type";
import {CaptchaVerifyInputType} from "../../_types/captcha-verify-input.type";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from "@angular/forms";
import {DntCaptchaComponent} from "../../_components/dnt-captcha/dnt-captcha.component";
import {LoadingService} from "../../_services/loading.service";
import {InputTextModule} from "primeng/inputtext";
import {requiredValidator} from "../../shared/validators/required-validator";
import {UserTypesEnum} from "../../_enums/user-types.enum";

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [
    ButtonModule,
    NgIf,
    FormsModule,
    DntCaptchaComponent,
    ReactiveFormsModule,
    CommonModule,
    InputTextModule,
    RouterLink
  ],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss'
})
export class WelcomePageComponent implements  OnInit{
  @ViewChild(DntCaptchaComponent) dntCaptchaComponent!: DntCaptchaComponent;

    // loading:boolean = false;
    isLogging = false;
    userType= UserTypesEnum;

    loginForm: UntypedFormGroup = this.loginForms()

    // loginForm: UntypedFormGroup = new FormGroup({
    //   userName: new FormControl('', { nonNullable: true, validators: Validators.required }),
    //   password: new FormControl('', { nonNullable: true, validators: Validators.required }),
    // });
  captchaForm: FormGroup = new FormGroup({
    dntCaptchaInputText: new FormControl('', { nonNullable: true, validators: Validators.required }),
    dntCaptchaText: new FormControl('', { nonNullable: true, validators: Validators.required }),
    dntCaptchaToken: new FormControl('', { nonNullable: true, validators: Validators.required })
  });

    constructor(private  router:Router,
                private  route: ActivatedRoute,
                private  authService:AuthenticationService,
                private loading: LoadingService) {

    }

    ngOnInit(): void {
    }


  loginForms(){
      return new UntypedFormGroup({
        'username': new UntypedFormControl(null, [requiredValidator()]),
        'password': new UntypedFormControl(null, [requiredValidator()]),
      })
  }
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.errors) {
      return control.errors['text'];
    }
    return '';
  }

  login() {
      this.loading.show();
    this.authService.loginSSCRM(this.loginForm.value).subscribe(res => {
      this.loading.hide()
      if (res.userType === this.userType.SystemAdmin) {
        this.router.navigateByUrl('/admin/company')
      } else {
        this.router.navigateByUrl('/activities')
      }
    }, error => {
      this.loading.hide()
    })
  }
}

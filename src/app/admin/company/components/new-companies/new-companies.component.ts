import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FieldsetModule} from "primeng/fieldset";
import {InputSwitchModule} from "primeng/inputswitch";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {CreateTenantDTO} from "../../_types/company.type";
import {BaseNewManager} from "../../../../_classes/base-new.manager";
import {ActivatedRoute, Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {CompanyService} from "../../company.service";
import {LoadingService} from "../../../../_services/loading.service";
import {BaseCompaniesDetailComponent} from "../base-companies-detail/base-companies-detail.component";
import {TabViewModule} from "primeng/tabview";

@Component({
  selector: 'app-new-companies',
  templateUrl: '../base-companies-detail/base-companies-detail.component.html',
  styleUrl: './new-companies.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RadioButtonModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
    FieldsetModule,
    InputSwitchModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    TabViewModule,
  ]
})
export class NewCompaniesComponent extends BaseCompaniesDetailComponent<CreateTenantDTO>{

  newManager: BaseNewManager<CreateTenantDTO>
  constructor(
    private companyService: CompanyService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {

    let manager = new BaseNewManager<CreateTenantDTO>(CreateTenantDTO, companyService, messageService, {}, router, activeRoute, loading)
    super(manager, companyService, loading);

    manager.BeforeSave.subscribe(res =>{
      if (!manager.oneObject.name){
        return this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'نام شرکت اجباری می باشد',
        })
        if (!manager.oneObject.dbName) {
          return this.messageService.add({
            severity: 'error',
            summary: 'خطا',
            detail: 'نام دیتابیس اجباری می باشد',
          })
        }

        manager.oneObject.disable = !manager.oneObject.disable

      }
    })

    manager.OnSuccessfulSave.subscribe((i)=>{
      router.navigate(['./'], {relativeTo:activeRoute.parent})
    });

    this.newManager = manager;

  }

  hasPermission(item: any): boolean {
    return this.manager.oneObject.permissionIds?.includes(item.id) ?? false;
  }


  onSwitchChange(item: any, checked: boolean) {
    const id = item.id;
    if (!this.manager.oneObject.permissionIds) {
      this.manager.oneObject.permissionIds = [];
    }
    const permissionIds = this.manager.oneObject.permissionIds;
    if (checked) {
      // اکنون می‌دانیم که permissionIds یک آرایه است و می‌توانیم از includes استفاده کنیم
      if (!permissionIds.includes(id)) {
        permissionIds.push(id);
      }
    } else {
      // این قسمت برای حذف کردن مشکلی ندارد، زیرا permissionIds یک آرایه است
      this.manager.oneObject.permissionIds = permissionIds.filter(x => x !== id);
    }
    console.log(this.manager.oneObject.permissionIds);
  }

}

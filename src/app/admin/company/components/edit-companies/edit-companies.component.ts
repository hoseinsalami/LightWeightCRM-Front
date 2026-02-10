import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";
import {RadioButtonModule} from "primeng/radiobutton";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FieldsetModule} from "primeng/fieldset";
import {InputSwitchModule} from "primeng/inputswitch";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {CreateTenantDTO} from "../../_types/company.type";
import {BaseEditManager} from "../../../../_classes/base-edit.manager";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {LoadingService} from "../../../../_services/loading.service";
import {CompanyService} from "../../company.service";
import {BaseCompaniesDetailComponent} from "../base-companies-detail/base-companies-detail.component";
import {TabViewModule} from "primeng/tabview";
import {MessageService} from "primeng/api";


@Component({
  selector: 'app-edit-companies',
  templateUrl: '../base-companies-detail/base-companies-detail.component.html',
  styleUrl: './edit-companies.component.scss',
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
    TabViewModule
  ]
})
export class EditCompaniesComponent extends BaseCompaniesDetailComponent<CreateTenantDTO> {
  newManager: BaseEditManager<CreateTenantDTO, CreateTenantDTO>

  constructor(
    private companyService: CompanyService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    loading: LoadingService
  ) {
    let manager =
      new BaseEditManager<CreateTenantDTO,CreateTenantDTO>(
        CreateTenantDTO,
        (input)=>{

          let permissionIds :number[] = [];
          input.permissionIds.map((p) =>{
            permissionIds.push(p);
          })
          let res = new CreateTenantDTO(input);
          res.permissionIds = permissionIds;
          return res;

        }, companyService, messageService, activeRoute , router ,loading);

    manager.validation = () => {
      if (manager.oneObject.name.length <= 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'خطا',
          detail: 'نام شرکت اجباری می باشد.',
        });
        return false;
      }

      // if (manager.oneObject.dbName.length <= 0) {
      //   this.messageService.add({
      //     severity: 'error',
      //     summary: 'خطا',
      //     detail: 'نام دیتابیس اجباری می باشد.',
      //   });
      //   return false;
      // }
        return true;
    }

    manager.afterReadEvent.subscribe((data) => {
      if (manager.oneObject && typeof manager.oneObject.disable === 'undefined') {
        manager.oneObject.disable = false;
      }
    });

    manager.BeforeSave.subscribe(res =>{
        // manager.oneObject.disable = !manager.oneObject.disable
        // if (!manager.oneObject.permissionIds) {
        //   manager.oneObject.permissionIds = [];
        // }
        // manager.oneObject.permissionIds = [...this.permissionIds]
        // console.log('Component this.permissionIds:', this.permissionIds)
        // console.log('Manager oneObject.permissionIds AFTER INJECTION:', manager.oneObject.permissionIds)
        // console.log(manager.oneObject)
      // }
    })

    manager.OnSuccessfulSave.subscribe((i) =>{
      router.navigate(['./'], {relativeTo:this.activeRoute.parent});
    });

    super(manager, companyService ,loading);
  }

  override get isEditMode(): boolean {
    const id = this.activeRoute.snapshot.params['id'];
    return !!id;
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

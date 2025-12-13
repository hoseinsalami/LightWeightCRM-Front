import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SmsConfigComponent} from "./sms-config.component";
import {AuthGuard} from "../../_guard/auth.guard";
import {NewSmsConfigComponent} from "./components/new-sms-config/new-sms-config.component";
import {EditSmsConfigComponent} from "./components/edit-sms-config/edit-sms-config.component";
import {NotfoundComponent} from "../../pages/notfound/notfound.component";


const routes: Routes = [
  {
    path: '',
    component: SmsConfigComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'new',
    component: NewSmsConfigComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'edit/:id',
    component: EditSmsConfigComponent ,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsConfigRoutingModule { }

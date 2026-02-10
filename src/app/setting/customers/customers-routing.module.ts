import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotfoundComponent} from "../../pages/notfound/notfound.component";
import {CustomersComponent} from "./customers.component";
import {NewCustomerComponent} from "./components/new-customer/new-customer.component";
import {EditCustomerComponent} from "./components/edit-customer/edit-customer.component";
import {AuthGuard} from "../../_guard/auth.guard";
import {CustomerDocumentComponent} from "./customer-document/customer-document.component";

const routes: Routes = [
  {
    path: '',
    component: CustomersComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'new',
    component: NewCustomerComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'edit/:id',
    component: EditCustomerComponent ,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'document/:id',
    component: CustomerDocumentComponent ,
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
export class CustomersRoutingModule { }

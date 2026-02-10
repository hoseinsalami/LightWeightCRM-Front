import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CompanyComponent} from "./company.component";
import {NotfoundComponent} from "../../pages/notfound/notfound.component";
import {NewCompaniesComponent} from "./components/new-companies/new-companies.component";
import {EditCompaniesComponent} from "./components/edit-companies/edit-companies.component";
import {AuthGuard} from "../../_guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: CompanyComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'new',
    component: NewCompaniesComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'edit/:id',
    component: EditCompaniesComponent ,
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
export class CompanyRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "../users/users.component";
import {NewUserComponent} from "../users/components/new-user/new-user.component";
import {EditUserComponent} from "../users/components/edit-user/edit-user.component";
import {NotfoundComponent} from "../../pages/notfound/notfound.component";
import {CariesComponent} from "./caries.component";
import {NewCariesComponent} from "./components/new-caries/new-caries.component";
import {EditCariesComponent} from "./components/edit-caries/edit-caries.component";
import {AuthGuard} from "../../_guard/auth.guard";
import {ConfigComponent} from "./config/config.component";

const routes: Routes = [
  {
    path: '',
    component: CariesComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'new',
    component: NewCariesComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'edit/:id',
    component: EditCariesComponent ,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'config/:pathId/:stepId',
    component: ConfigComponent ,
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
export class CariesRoutingModule { }

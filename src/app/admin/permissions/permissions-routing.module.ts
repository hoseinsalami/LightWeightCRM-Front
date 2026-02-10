import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotfoundComponent} from "../../pages/notfound/notfound.component";
import {PermissionsComponent} from "./permissions.component";
import {NewPermissionComponent} from "./components/new-permission/new-permission.component";
import {EditPermissionComponent} from "./components/edit-permission/edit-permission.component";
import {AuthGuard} from "../../_guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: PermissionsComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'new',
    component: NewPermissionComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'edit/:id',
    component: EditPermissionComponent,
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
export class PermissionsRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ActivitiesComponent} from "./activities.component";
import {AuthGuard} from "../_guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: ActivitiesComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivitiesRoutingModule { }

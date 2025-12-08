import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PathComponent} from "./path.component";
import {AuthGuard} from "../_guard/auth.guard";

const routes: Routes = [
  {
    path: ':id',
    component: PathComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PathRoutingModule { }

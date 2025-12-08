import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotfoundComponent} from "../../pages/notfound/notfound.component";
import {TagComponent} from "./tag.component";
import {NewTagComponent} from "./components/new-tag/new-tag.component";
import {EditTagComponent} from "./components/edit-tag/edit-tag.component";
import {AuthGuard} from "../../_guard/auth.guard";

const routes: Routes = [
  { path: '',
    component: TagComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  { path: 'new',
    component: NewTagComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  { path: 'edit/:id',
    component: EditTagComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagRoutingModule { }

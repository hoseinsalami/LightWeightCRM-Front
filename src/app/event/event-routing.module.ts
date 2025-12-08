import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NotfoundComponent} from "../pages/notfound/notfound.component";
import {EventComponent} from "./event.component";
import {NewEventComponent} from "./components/new-event/new-event.component";
import {EditEventComponent} from "./components/edit-event/edit-event.component";
import {AuthGuard} from "../_guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: EventComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'new',
    component: NewEventComponent,
    canActivate: [AuthGuard],
    data: {permission: 'everyOne'}
  },
  {
    path: 'edit/:id',
    component: EditEventComponent,
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
export class EventRoutingModule { }

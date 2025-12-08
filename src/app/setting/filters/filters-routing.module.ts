import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FiltersComponent} from "./filters.component";
import {NewFilterComponent} from "./components/new-filter/new-filter.component";
import {EditFilterComponent} from "./components/edit-filter/edit-filter.component";
import {NotfoundComponent} from "../../pages/notfound/notfound.component";
import {AuthGuard} from "../../_guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: FiltersComponent,
    canActivate: [AuthGuard],
    data: {permission: 'filter'}
  },
  {
    path: 'new',
    component: NewFilterComponent,
    canActivate: [AuthGuard],
    data: {permission: 'filter'}
  },
  {
    path: 'edit/:id',
    component: EditFilterComponent,
    canActivate: [AuthGuard],
    data: {permission: 'filter'}
  },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiltersRoutingModule { }

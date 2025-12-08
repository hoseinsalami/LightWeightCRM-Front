import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import {WorkItemComponent} from "../../work-item/work-item.component";

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent},
        // { path: 'path', loadChildren: () => import('../../path/path.module').then(w => w.PathModule)},
        // { path: 'workItem/:id', component: WorkItemComponent},
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }

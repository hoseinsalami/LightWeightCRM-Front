import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import {WelcomePageComponent} from "./pages/welcome-page/welcome-page.component";
import {LogoutComponent} from "./pages/logout/logout.component";
import {SettingModule} from "./setting/setting.module";
import {TicketsComponent} from "./tickets/tickets.component";
import {WorkItemComponent} from "./work-item/work-item.component";
import {SystemAdminComponent} from "./pages/system-admin/system-admin.component";
import {AuthGuard} from "./_guard/auth.guard";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: WelcomePageComponent,
            },
            {
                path: 'afterAuth', component: WelcomePageComponent,
            },
            {
                path: 'logout', component: LogoutComponent,
            },
            {
                path: '', component: AppLayoutComponent,

                children: [
                    { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)},
                    { path: 'setting', loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule)},
                    { path: 'tickets', loadChildren: () => import('./tickets/tickets.module').then(t => t.TicketsModule)},
                    { path: 'activities', loadChildren: () => import('./activities/activities.module').then(a => a.ActivitiesModule)},
                    { path: 'path', loadChildren: () => import('./path/path.module').then(w => w.PathModule)},
                    { path: 'reports', loadChildren: () => import('./reports/reports.module').then(r => r.ReportsModule)},
                    { path: 'workItem/:id', component: WorkItemComponent, canActivate: [AuthGuard], data: {permission: 'everyOne'} },
                  {
                    path: 'admin', component: SystemAdminComponent,
                    children: [
                      { path: 'company', loadChildren: () => import('./company/company.module').then(c => c.CompanyModule)},
                      { path: 'sms', loadChildren: () => import('./service-provider/service-provider.module').then(s => s.ServiceProviderModule)},
                      { path: 'event', loadChildren: () => import('./event/event.module').then(e => e.EventModule)},
                      { path: 'permissions', loadChildren: () => import('./permissions/permissions.module').then(p => p.PermissionsModule)}
                    ]
                  },
                    // { path: 'monitor', loadChildren: () => import('./monitor/monitor-routing.module').then(m => m.MonitorRoutingModule)},
                    // { path: 'notices', loadChildren: () => import('.//smoky-cars-notices/notices.module').then(m => m.NoticesModule) },
                    // { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    // { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    // { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
                ]
            },
            // { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            // { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

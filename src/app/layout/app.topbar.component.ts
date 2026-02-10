import {Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import {Router, RouterLink} from '@angular/router';
import {CommonModule, DatePipe, NgClass, NgIf} from '@angular/common';
import {AuthenticationService} from "../_services/authentication.service";
import {distinctUntilChanged, startWith, take} from "rxjs/operators";
import {LoginOutputSscrmType, LoginOutputType} from "../_types/login-output.type";
import {TooltipModule} from "primeng/tooltip";
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";
import {ButtonModule} from "primeng/button";
import {DashboardService} from "../_services/dashboard.service";
import {OverlayPanel, OverlayPanelModule} from "primeng/overlaypanel";
import {CreateActivityType} from "../_types/create-activity.type";
import {CollectorSignalRService} from "../_services/collector-signal-r.service";
import {JalaliDatePipe} from "../_pipes/jalali.date.pipe";
import {UserTypesEnum, UserTypesEnum2LabelMapping} from "../_enums/user-types.enum";
import {DashboardTypeBase} from "../_types/dashboard.output.type";
import {SearchType} from "../path/_types/search.type";
import {PathService} from "../path/path.service";
import {ActivityNoteService} from "../_components/activity-note/activity-note.service";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule} from "@angular/forms";
import {debounceTime, interval, map, Observable, switchMap} from "rxjs";
import {SidebarModule} from "primeng/sidebar";
import {PanelMenuModule} from "primeng/panelmenu";
import {ServerTimeService} from "../_services/server-time.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [`
        ul li {
          position: relative;
        }
        ul li.active-tab::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 100%;
          background-color: #22c55e;
          color: #22c55e;
          border-radius: 2px;
        }
        li {
          cursor: pointer;
          padding-bottom: 0.2rem;
          position: relative;
          color: #374151; /* پیش‌فرض خاکستری تیره */
          transition: color 0.2s ease;
        }

        li.active-tab {
          color: #22c55e !important;
        }
        .p-card::-webkit-scrollbar {
          width: 6px; /* پهنای اسکرول */
        }

        .p-card::-webkit-scrollbar-track {
          background: #f1f1f1;      /* رنگ بک‌گراند */
          border-radius: 10px;
        }

        .p-card::-webkit-scrollbar-thumb {
          background: #9ca3af;      /* رنگ خود اسکرول */
          border-radius: 10px;
        }

        .p-card::-webkit-scrollbar-thumb:hover {
          background: #6b7280;      /* رنگ موقع هاور */
        }

        /* برای فایرفاکس */
        .p-card {
          scrollbar-width: thin;          /* باریک */
          scrollbar-color: #9ca3af #f1f1f1; /* رنگ اسکرول + رنگ بک‌گراند */
        }

        .search-input{
          background-color: rgba(255, 255, 255, 0.1);
          border: 1px solid #6b7280;
          border-radius: 0.375rem;
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          color: #ffffff;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-input::placeholder{
          /*color: #9ca3af;*/
          color: #fff;
        }

        .search-input:focus{
          border-color: #3B82F6;
          box-shadow: 0 0 0 2px #3B82F6;
          color: #000
        }

        /* استایل های ساید بار موبایل */
        p-sidebar{
          hr{ border-color:#656565; }
          .p-panelmenu-header-content{
            background:none !important;
            border-color:#656565;
          }
          .p-panelmenu-header-action{
            padding: 1rem 0.5rem !important;
            color:#b5cf38;
          }

          .p-panelmenu-content{
            background:#444;
            border-color:#656565;
          }

          .p-sidebar-active{
            background:#444;
            color:#b5cf38;
          }

          .p-menuitem-text , .p-menuitem-icon{
            color:#b5cf38
          }

          /* استایل active-item زمان کلیک روی ایتم های منو(routerLinkActive) */
          .p-menuitem-link-active {
            background: #f2d066 !important;
            .p-menuitem-text, .p-menuitem-icon{
              color: #111827 !important;
            }
          }

          .p-panelmenu .p-panelmenu-content .p-menuitem:not(.p-highlight):not(.p-disabled) > .p-menuitem-content:hover{
            background:none !important;
          }
        }

        .custom-menu-item .p-menuitem-content:hover{
          background: var(--green-100) !important;
        }
        .custom-menu-item .p-menuitem-content .p-menuitem-link {
          justify-content: center;
        }
        .custom-menu-item .p-menuitem-link .p-menuitem-text{
          color: green !important;
        }


    `],
    standalone: true,
    imports: [
      CommonModule,
      NgClass,
      RouterLink,
      TooltipModule,
      AvatarModule,
      MenuModule,
      NgIf,
      ButtonModule,
      OverlayPanelModule,
      DatePipe,
      JalaliDatePipe,
      InputTextModule,
      FormsModule,
      SidebarModule,
      PanelMenuModule,
    ],
  providers:[JalaliDatePipe]
})
export class AppTopBarComponent implements OnInit{

    items!: MenuItem[];
    mobileMenuVisible = false;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    protected readonly UserTypesEnum2LabelMapping = UserTypesEnum2LabelMapping

    user:LoginOutputSscrmType|undefined = undefined;

    profileItem: MenuItem[] = [
      {
        label: 'کاربران',
        icon: 'pi pi-fw pi-users',
        routerLink: ['/setting/users'],
        permission: ['everyOne'],
        command: () => {this.clearTableDataInLocalStorage('users')},
      },
      // {
      //   label: 'مشتریان',
      //   icon: 'pi pi-fw pi-user',
      //   routerLink: ['/setting/customers'],
      //   permission: ['everyOne'],
      //   command: () => {this.clearTableDataInLocalStorage('customers')},
      // },
      {
        label: 'جریان ها',
        icon: 'pi pi-fw pi-bolt',
        routerLink: ['/setting/caries'],
        permission: ['everyOne'],
        command: () => {this.clearTableDataInLocalStorage('caries')},
      },
      {
        label: 'نوع فعالیت',
        icon: 'pi pi-fw pi-briefcase',
        routerLink: ['/setting/activities'],
        permission: ['everyOne'],
        command: () => {this.clearTableDataInLocalStorage('activities')},
      },
      {
        label: 'شیوه آشنایی',
        icon: 'pi pi-fw pi-eye',
        routerLink: ['/setting/accustom'],
        permission: ['everyOne'],
        command: () => {this.clearTableDataInLocalStorage('accustom')},
      },
      {
        label: 'برچسب ها',
        icon: 'pi pi-fw pi-tags',
        routerLink: ['/setting/tag'],
        permission: ['everyOne'],
        command: () => {this.clearTableDataInLocalStorage('tag')},
      },
      {
        label: 'دلایل شکست',
        icon: 'pi pi-fw pi-comments',
        routerLink: ['/setting/failures'],
        permission: ['everyOne'],
        command: () => {this.clearTableDataInLocalStorage('failures')},
      },
      {
        label: 'تنظیمات تیکت',
        icon: 'pi pi-box',
        permission: ['Ticket'],
        routerLink: ['/setting/ticket-config'],
        command: () => {this.clearTableDataInLocalStorage('ticket-config')},
      },
      {
        label: 'تنظیمات پیامک',
        icon: 'pi pi-comment',
        permission: ['everyOne'],
        routerLink: ['/setting/sms-config'],
        command: () => {this.clearTableDataInLocalStorage('sms-config')},
      },
      {
        label: 'فیلتر',
        icon: 'pi pi-box',
        permission: ['Filter'],
        routerLink: ['/setting/filter'],
      },
      {
        label: 'خودکار سازی فرایند ها',
        icon: 'pi pi-code',
        permission: ['Process'],
        routerLink: ['/setting/process-automation'],
      },
      {
        label: 'عامل فعال',
        icon: 'pi pi-comment',
        permission: ['everyOne'],
        routerLink: ['/setting/agent'],
      },
      {
        label: 'ارتباط با پشتیبان',
        icon: 'pi pi-comment',
        permission: ['everyOne'],
        routerLink: ['/setting/tenantTicket'],
      },
      {
        label: 'سند',
        icon: 'pi pi-comment',
        permission: ['everyOne'],
        routerLink: ['/setting/document'],
      },
      {
        label: 'نظرسنجی',
        icon: 'pi pi-comment',
        permission: ['everyOne'],
        routerLink: ['/setting/survey'],
      },
    ];

    reportItems: MenuItem[] = [
    {
      label: 'تیکت ها',
      routerLink: ['/reports/tickets'],
    },
    {
      label: 'جریان ها',
      routerLink: ['/reports/caries'],
    },
    {
      label: 'فعالیت ها',
      routerLink: ['/reports/activities'],
    },
  ];

    cariesItem: MenuItem[];
    ticketItem: MenuItem[];
    panelMenuItems: MenuItem[];


  dashboardRes?:DashboardTypeBase;
  newTicketCount?:number;
  protected readonly UserTypesEnum = UserTypesEnum

    @ViewChild('op') overlayPanel!: OverlayPanel;
    @ViewChild('bellBtn') bellButton!: ElementRef;
    latestActivity: any;

    serverTime$: Observable<Date | null> = null;
    serverTimestamp: number | null = null;
    constructor(public layoutService: LayoutService,
                private authService:AuthenticationService,
                private dashboardService: DashboardService,
                private collectorSignalRService: CollectorSignalRService,
                private pathService: PathService,
                private activityNoteService:ActivityNoteService,
                private router: Router,
                private serverTimeService: ServerTimeService) {

        authService.token?.pipe(take(1)).subscribe(token => {
            this.user = token
            //this.profileItem[0].label = this.user.fullName
        });
        // this.getMenuInfo()
    }

    ngOnInit() {
      this.serverTimeService.onServerTimeChange().subscribe(time => {
        if (!time) return;
        const ts = new Date(time.replace(' ', 'T')).getTime();
        if (!isNaN(ts)) {
          this.serverTimestamp = ts;
        }
      });

      // هر ثانیه ساعت آپدیت شود
      this.serverTime$ = interval(1000).pipe(
        map(() => {
          if (this.serverTimestamp === null) return null;
          // هر بار یک ثانیه اضافه می‌کنیم
          this.serverTimestamp += 1000;
          return new Date(this.serverTimestamp);
        }),
        startWith(this.serverTimestamp !== null ? new Date(this.serverTimestamp) : null)
      );


      this.collectorSignalRService.newReminderDataSubject.subscribe((activity) => {
        if (activity) {
          this.latestActivity = activity;
          console.log(this.latestActivity)
          // باز کردن OverlayPanel
          setTimeout(() => {
            this.overlayPanel.show(null, this.bellButton.nativeElement);
          }, 0); // در صورت استفاده در ngOnInit یا خارج از رویداد DOM باید با تأخیر اجرا شود
        }
      });


      // آپدیت مقدار Badge در هدر براساس ticketType
      this.collectorSignalRService.newTicketDataSubject.subscribe((newData) => {
        if (!newData || !newData.ticket) {
          return;
        }

        const stored = localStorage.getItem('ticketPaths');
        if (!stored) return;

        const ticketPaths = JSON.parse(stored);
        const matched = ticketPaths.find(t => t.ticketType === newData.ticket.ticketType);

        if (matched) {
          const index = this.ticketItem.findIndex(t => +t.id === matched.id);
          if (index !== -1) {
            this.ticketItem[index] = {
              ...this.ticketItem[index],
              badge: String(matched.newTicketCount)
            };
            this.ticketItem = [...this.ticketItem];

          }
        }
      });

      this.pathService.searchSubject
        .pipe(
          debounceTime(300),
          distinctUntilChanged()      // فقط وقتی متن تغییر کرد
        )
        .subscribe(query => {
          this.searchAll(query);
        });

      if (this.user.userType !== this.UserTypesEnum.SystemAdmin) {
        this.getMenuInfo()
      }

      this.SetMenuVisibility(this.profileItem)

    }

  get serverTimeForView(): Date | null {
    const time = this.serverTimeService.getServerTime();
    if (!time) return null;

    const date = new Date(time.replace(' ', 'T'));
    return isNaN(date.getTime()) ? null : date;
  }




  getMenuInfo(){
      this.dashboardService.getDashboard().subscribe((res) =>{
        this.dashboardRes = res;
        this.cariesItem = [];
        this.ticketItem = [];
        this.panelMenuItems = []

        const ticketStorageData = res.ticketPaths.map(t => ({
          ticketType: t.ticketType,
          id: t.id,
          title: t.title,
          newTicketCount: t.newTicketCount
        }));
        localStorage.setItem('ticketPaths', JSON.stringify(ticketStorageData));

        const stored = localStorage.getItem('ticketPaths');
        let storedTicketPaths: any[] = stored ? JSON.parse(stored) : [];


        this.dashboardRes.otherPaths.forEach(item =>{
          this.cariesItem.push({
            label: item.title,
            routerLinkActiveOptions: { exact: true },
            routerLink: [`/path/${item.id}`],
          });
        })
        if (this.cariesItem.length == 0 ) {
          this.cariesItem.push({
            label: 'ایجاد کاریز',
            routerLinkActiveOptions: { exact: true },
            routerLink: [`/setting/caries/new`],
            styleClass: 'custom-menu-item'
          });
        }


        this.dashboardRes.ticketPaths.forEach(item => {
          const matched = storedTicketPaths.find(t => t.ticketType === item.ticketType);

          this.ticketItem.push({
            id: String(item.id),
            label: item.title,
            badge: matched ? String(matched.newTicketCount) : '0',
            routerLink: [`/ticket/${item.id}`],
          })
        })

        this.panelMenuItems.push(
          {
            label: 'کاریز',
            icon: 'pi pi-folder',
            expanded: this.router.url.startsWith('/path'),
            items: this.cariesItem
          },
          {
            label: 'تنظیمات',
            icon: 'pi pi-cog',
            expanded: this.router.url.startsWith('/setting'),
            items: this.profileItem
          }
        )

      })
    }

  clearTableDataInLocalStorage(route:string){
    switch (route) {
      case 'users':
        localStorage.removeItem('userTable');
        break;
      case 'customers':
        localStorage.removeItem('customerTable');
        break;
      case 'caries':
        localStorage.removeItem('cariesTable');
        break;
      case 'activities':
        localStorage.removeItem('activitiesTable');
        break;
      case 'tag':
        localStorage.removeItem('tagTable');
        break;
      case 'accustom':
        localStorage.removeItem('accustomTable');
        break;
        case 'sms-config':
        localStorage.removeItem('smsTable');
        break;
      case 'failures':
        localStorage.removeItem('failureTable');
        break;
      default : ''
    }

  }


  icons = [
    { name: 'همه', class: 'pi pi-bars', key: 'all' },
    { name: 'مشتری', class: 'pi pi-user', key: 'customers' },
    { name: 'فعالیت', class: 'pi pi-bell', key: 'activities' },
    { name: 'قلم کاری', class: 'pi pi-box', key: 'workItems' },
  ];
  selectedIcon: any = this.icons[0];
  filteredItems: any[] = [];
  allData: SearchType | null = null;
  searchText: string = '';
  cardVisible = false;
  searchAll(query:string){
    const trimmed = query?.trim() ?? '';
    if (trimmed === '') {
      this.allData = null;
      this.filteredItems = [];
      return;
    }
    this.pathService.onSearchAll(query).subscribe({
      next: (out) => {
        this.allData = out; // ذخیره نتایج
        this.updateFilteredItems();
      },
      error: err => {
        this.allData = null;
        this.filteredItems = [];
      }
    });
  }

  updateFilteredItems(){
    if (!this.allData) return;

    if (this.selectedIcon?.key === 'all') {
      this.filteredItems = [
        ...(this.allData.activities ?? []).map(item => ({ ...item, iconClass: this.getIconClassByKey('activities'), category: 'activities' })),
        ...(this.allData.workItems ?? []).map(item => ({ ...item, iconClass: this.getIconClassByKey('workItems'), category: 'workItems', })),
        ...(this.allData.customers ?? []).map(item => (
          { ...item, iconClass: this.getIconClassByKey('customers'), category: 'customers',
            phonesString: item.extraInfo?.phones?.map(p => p.phoneNumber).join(', ') || null
          }
        )),
      ];
    } else {
      const key = this.selectedIcon.key;
      const data = (this.allData as any)[key] ?? [];
      this.filteredItems = data.map((item: any) => (
        { ...item,
          iconClass: this.getIconClassByKey(key),
          ...(key === 'customers' ? { phonesString: item.extraInfo?.phones?.map(p => p.phoneNumber).join(', ') || null } : {})
        })
      );
    }
  }

  lastQuery = ''
  onSearchInput(event: any) {
    const query = event.target.value;
    if (query !== this.lastQuery) {   // lastQuery = مقدار قبلی
      this.lastQuery = query;
      this.pathService.searchSubject.next(query);
    }
  }

  getIconClassByKey(key: string): string {
    return this.icons.find(i => i.key === key)?.class ?? '';
  }

  selectIcon(icon: any) {
    this.selectedIcon = icon;
    this.updateFilteredItems();
  }

  selecteIFilterItems(item:any){

    switch (item.category) {
      case 'activities':
        this.activityNoteService.openActivityModal(item.id);
        this.cardVisible = false;
        break;

      case 'customers':
        this.router.navigateByUrl(`/setting/customers/edit/${item.id}`);
        this.cardVisible = false;
        break;

      case 'workItems':
        this.router.navigateByUrl(`/workItem/${item.id}`);
        this.cardVisible = false;
        break;
    }
  }

  showCard() {
    this.cardVisible = true;
  }
  // وقتی کاربر خارج از کارت یا input کلیک کرد، کارت بسته بشه
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const wrapper = document.querySelector('.search-wrapper');

    if (this.cardVisible && wrapper && !wrapper.contains(target)) {
      this.cardVisible = false;
    }
  }


  SetMenuVisibility(item:any[]) {
    let itemVis = false;
    if (item instanceof Array){
      item.forEach((t) => {
        let vis = false;
        t.permission?.forEach((p) => {
          vis = vis || this.authService.hasRoutePermission(p);
        });
        const childrenVisibility =this.SetMenuVisibility(t.items);
        t.visible = vis || childrenVisibility;
        itemVis = itemVis||vis;
      });
      return itemVis;
    }
    else if (item){
      let vis = false;
      let itemObj = <any> item;
      itemObj.permission?.forEach((p) => {
        vis = vis || this.authService.hasRoutePermission(p);
      });
      itemObj.visible = vis || this.SetMenuVisibility(itemObj.items);
      return itemObj.visible;
    }

    return  false;
  }
}

import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import {Router, RouterLink} from '@angular/router';
import {CommonModule, DatePipe, NgClass, NgIf} from '@angular/common';
import {AuthenticationService} from "../_services/authentication.service";
import {take} from "rxjs/operators";
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

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
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
      FormsModule
    ],
  providers:[JalaliDatePipe]
})
export class AppTopBarComponent implements OnInit{

    items!: MenuItem[];

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
      {
        label: 'مشتریان',
        icon: 'pi pi-fw pi-user',
        routerLink: ['/setting/customers'],
        permission: ['everyOne'],
        command: () => {this.clearTableDataInLocalStorage('customers')},
      },
      {
        label: 'کاریز ها',
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
        label: 'مدیریت برچسب ها',
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
        permission: ['ticket'],
        routerLink: ['/setting/ticket-config'],
        command: () => {this.clearTableDataInLocalStorage('ticket-config')},
      },
      {
        label: 'فیلتر',
        icon: 'pi pi-box',
        permission: ['filter'],
        routerLink: ['/setting/filter'],
      },
      {
        label: 'خودکار سازی فرایند ها',
        icon: 'pi pi-asterisk',
        permission: ['process'],
        routerLink: ['/setting/process-automation'],
      },
    ];

    reportItems: MenuItem[] = [
    {
      label: 'تیکت ها',
      routerLink: ['/reports/tickets'],
      command: () => {
        this.setActiveItem('تیکت ها');
      }
    },
    {
      label: 'کاریز ها',
      routerLink: ['/reports/caries'],
      command: () => {
        this.setActiveItem('کاریز ها');
      }
    },
    {
      label: 'فعالیت ها',
      routerLink: ['/reports/activities'],
      command: () => {
        this.setActiveItem('فعالیت ها');
      }
    },
  ];

    cariesItem: MenuItem[];
    ticketItem: MenuItem[];


  dashboardRes?:DashboardTypeBase;
  newTicketCount?:number;
  protected readonly UserTypesEnum = UserTypesEnum

    selectedItem:any;
    @ViewChild('op') overlayPanel!: OverlayPanel;
    @ViewChild('bellBtn') bellButton!: ElementRef;
    latestActivity: any;
    constructor(public layoutService: LayoutService,
                private authService:AuthenticationService,
                private dashboardService: DashboardService,
                private collectorSignalRService: CollectorSignalRService,
                private pathService: PathService,
                private activityNoteService:ActivityNoteService,
                private router: Router) {
        authService.token?.pipe(take(1)).subscribe(token => {
            this.user = token
            //this.profileItem[0].label = this.user.fullName
        });
        // this.getMenuInfo()
    }

    ngOnInit() {
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


      if (this.user.userType !== this.UserTypesEnum.SystemAdmin) {
        this.getMenuInfo()
      }

      this.SetMenuVisibility(this.profileItem)

    }


  getMenuInfo(){
      this.dashboardService.getDashboard().subscribe((res) =>{
        this.dashboardRes = res;
        this.cariesItem = [];
        this.ticketItem = [];

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
            command: () => {
              this.setActiveItem(item.title);
              this.router.navigate([`/path/${item.id}`]);
            }
          })
        })

        this.dashboardRes.ticketPaths.forEach(item => {
          const matched = storedTicketPaths.find(t => t.ticketType === item.ticketType);

          this.ticketItem.push({
            id: String(item.id),
            label: item.title,
            badge: matched ? String(matched.newTicketCount) : '0',
            routerLink: [`/ticket/${item.id}`],
            command: () => {
              this.setActiveItem(item.title);
              // this.router.navigateByUrl(`/ticket/${item.id}`);
            }
          })
        })
      })
    }

  clearTableDataInLocalStorage(route:string){
    switch (route) {
      case 'users':
        localStorage.removeItem('userTable');
        this.setActiveItem('کاربران')
        break;
      case 'customers':
        localStorage.removeItem('customerTable');
        this.setActiveItem('مشتریان')
        break;
      case 'caries':
        localStorage.removeItem('cariesTable');
        this.setActiveItem('کاریز ها')
        break;
      case 'activities':
        localStorage.removeItem('activitiesTable');
        this.setActiveItem('نوع فعالیت')
        break;
      case 'tag':
        localStorage.removeItem('tagTable');
        this.setActiveItem('مدیریت برچسب ها')
        break;
      case 'accustom':
        localStorage.removeItem('accustomTable');
        this.setActiveItem('شیوه آشنایی')
        break;
      case 'failures':
        localStorage.removeItem('failureTable');
        this.setActiveItem('دلایل شکست')
        break;
      default : ''
    }

  }

  setActiveItem(item:any){
      this.selectedItem = item
  }

  isCariesActive(): boolean {
    return this.cariesItem.some(menuItem => menuItem.label === this.selectedItem);
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
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    // اگر روی input یا کارت کلیک نکرده بود
    const clickedInsideInput  = target.closest('input[pInputText]');
    const clickedInsideCard = target.closest('.p-card');
    if (!clickedInsideInput && !clickedInsideCard) {
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

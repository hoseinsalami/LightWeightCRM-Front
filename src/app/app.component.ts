import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet} from '@angular/router';
import {CustomMessageComponent} from "./_components/custom-message/custom-message.component";
import {LoadingService} from "./_services/loading.service";
import {LoadingComponent} from "./_components/loading/loading.component";
import {NgIf} from "@angular/common";
import {CollectorSignalRService} from "./_services/collector-signal-r.service";
import {CreateActivityType} from "./_types/create-activity.type";
import {NotificationToastComponent} from "./_components/notification-toast/notification-toast.component";
import {NotificationToastService} from "./_components/notification-toast/notification-toast.service";
import {webSocket} from "rxjs/webSocket";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [RouterOutlet, CustomMessageComponent, LoadingComponent, NgIf, NotificationToastComponent]
})
export class AppComponent implements OnInit {

  notifications: any[] = [];

    constructor(
      private primengConfig: PrimeNGConfig ,
      private loading: LoadingService,
      private collectSignalRService: CollectorSignalRService,
      private notificationService: NotificationToastService
      ) {
      // for Reminders
      this.collectSignalRService.connect();
      this.collectSignalRService.newReminderDataSubject.subscribe(activity =>{

        if (activity){
          const notification = {
            ...activity,
            notificationId: Date.now(), // شناسه یکتا برای هر نوتیفیکیشن
          };
          this.notifications.push(notification);
          this.confirmActivity(notification.activityReminderId);
        }
        console.log(this.notifications)
      });

      // for Tickets
      this.collectSignalRService.connectTicket()
      this.collectSignalRService.newTicketDataSubject.subscribe(ticket => {

        if (ticket){
          const notification = {
            ...ticket,
            notificationId: Date.now(), // شناسه یکتا برای هر نوتیفیکیشن
          };
          // this.notifications.push({ ...ticket })
          this.notifications.push(notification)
          this.updateLocalStorageTicket(notification)
        }
        console.log(this.notifications)
      });

    }

    ngOnInit() {
        this.primengConfig.ripple = true;

        this.primengConfig.setTranslation({
            "startsWith": "شروع شود",
            "contains": "شامل",
            "notContains": "شامل نشود",
            "endsWith": "در انتها",
            "equals": "مطابق",
            "notEquals": "مطابق نباشد",
            "noFilter": "بدون فیلتر",
            "lt": "کوچکتر",
            "lte": "کوچکتر یا مساوی",
            "gt": "بزرگتر",
            "gte": "بزرگتر یا مساوی",
            "is": "مساوی",
            "isNot": "مخالف",
            "before": "قبل از",
            "after": "بعد از",
            "clear": "حذف فیلتر",
            "apply": "اعمال",
            "matchAll": "همه شروط با هم",
            "matchAny": "یکی از شروط",
            "addRule": "اضافه کردن شرط",
            "removeRule": "حذف شرط",
            "accept": "قبول",
            "reject": "رد",
            "choose": "انتخاب",
            "upload": "بارگذاری",
            "cancel": "انصراف",
            "dayNames": ["یکشنبه", "دوشنبه", "سه شنبه", "چهارشنبه", "پنج شنبه", "جمعه", "شنبه"],
            "dayNamesShort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            "dayNamesMin": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            "monthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            "monthNamesShort": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "today": "امروز",
            "weekHeader": "Wk",
            "weak": 'ضعیف',
            "medium": 'متوسط',
            "strong": 'مناسب',
            "passwordPrompt": 'Enter a password',
            "emptyMessage": 'اطلاعاتی یافت نشد',
            "emptyFilterMessage": 'نتیجه ای بازگردانده نشد',
            "dateIs": 'مطابق',
        });
    }

  updateLocalStorageTicket(newData: { newTicketCount: number, ticket: any }) {
    const stored = localStorage.getItem('ticketPaths');
    if (!stored) return;

    const ticketPaths = JSON.parse(stored);

    const index = ticketPaths.findIndex(t => t.ticketType === newData.ticket.ticketType);
    if (index !== -1) {
      ticketPaths[index].newTicketCount = newData.newTicketCount;
    } else {
      ticketPaths.push({
        ticketType: newData.ticket.ticketType,
        id: newData.ticket.id,
        title: newData.ticket.title,
        newTicketCount: newData.newTicketCount
      });
    }

    localStorage.setItem('ticketPaths', JSON.stringify(ticketPaths));
  }

  removeNotification(notificationIdToRemove: number) {
    this.notifications = this.notifications.filter(notification => {
      return notification.notificationId !== notificationIdToRemove;
    });
  }

  confirmActivity(id:number){
    this.loading.show();
    this.notificationService.onConfirmReminderToast(id).subscribe({
      next: (out) =>{
        this.loading.hide();
      },
      error: () =>{
        this.loading.hide();
      }
    })
  }

}

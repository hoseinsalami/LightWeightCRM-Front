import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {JalaliDatePipe} from "../../_pipes/jalali.date.pipe";
import {CommonModule, NgFor} from "@angular/common";
import {TicketTypeEnum, TicketTypeEnum2LabelMapping} from "../../_enums/ticket-type.enum";
import {Router, RouterLink} from "@angular/router";
import {LoadingService} from "../../_services/loading.service";
import {NotificationToastService} from "./notification-toast.service";

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  imports: [CommonModule, JalaliDatePipe, NgFor, RouterLink],
  templateUrl: './notification-toast.component.html',
  styleUrl: './notification-toast.component.scss'
})
export class NotificationToastComponent implements OnInit{
  @Input() notifications: any[] = [];
  @Input() Type: any;
  @Output() remove = new EventEmitter<number>();

  protected readonly TicketTypeEnum = TicketTypeEnum
  protected readonly TicketTypeEnum2LabelMapping = TicketTypeEnum2LabelMapping

  constructor(
    private router: Router,
    private notificationService: NotificationToastService,
    private loading: LoadingService) {
  }

  onRemoveClick(id: number) {
    this.remove.emit(id);
  }

  ngOnInit(): void {}

  goToTicketDetail(ticketType:number,id:number,notificationId:number) {
    this.router.navigateByUrl(`/tickets/${ticketType}/${id}`);
    this.onRemoveClick(notificationId);
  }
}

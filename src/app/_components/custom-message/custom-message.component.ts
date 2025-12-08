import { Component } from '@angular/core';
import {CustomMessageService} from "../../_services/custom-message.service";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-custom-message',
  standalone: true,
    imports: [
        ToastModule
    ],
  templateUrl: './custom-message.component.html',
  styleUrl: './custom-message.component.scss'
})
export class CustomMessageComponent {

    constructor(private customMessageService:CustomMessageService,
                private messageService:MessageService) {

        this.customMessageService.newMessage$.subscribe((mess)=>{
            //debugger
            let typeStr:string = mess.type.toLowerCase();
            let summary:string;

            if(mess.type == 'Error'){
                summary = 'خطا'
            }
            else {
                summary = 'موفق'
            }

            this.messageService.add({
                summary:summary,
                severity:typeStr,
                detail:mess.message,
                life:3000
            });
        })
    }
}

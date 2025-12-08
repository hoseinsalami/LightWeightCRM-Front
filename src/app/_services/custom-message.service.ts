import {Injectable} from "@angular/core";
import {MessageService} from "primeng/api";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CustomMessageService {

    newMessage$=new Subject<{type:'Error' | 'Success', message:string}>();
    constructor() {
    }

    showError(message:string){
        this.newMessage$.next({type:'Error', message:message})
    }

    showSuccess(message:string){
        this.newMessage$.next({type:'Success', message:message})
    }
}

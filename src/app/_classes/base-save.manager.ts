import {IHaveSaveManagerInterface} from "../_interfaces/i-have-save-manager.interface";
import {EventEmitter} from "@angular/core";

export abstract class BaseSaveManager<T> implements IHaveSaveManagerInterface<T>{
    _showDialog: boolean;
    isSending: boolean;
    oneObject: T;
    response: any;
    OnSuccessfulSave: EventEmitter<T> = new EventEmitter<T>();
    BeforeSave: EventEmitter<T> = new EventEmitter<T>();

    save() {
    }

    cancel(url:string='./') {
    }

    validation():boolean{
      return true
    }
}

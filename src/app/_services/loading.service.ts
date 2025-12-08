import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  // private loadingSubject = new BehaviorSubject<boolean>(false);
  // loading$ = this.loadingSubject.asObservable();
  //
  // show() {
  //   this.loadingSubject.next(true);
  // }
  //
  // hide() {
  //   this.loadingSubject.next(false);
  // }


  isLoading  = new BehaviorSubject<boolean>(false);

  constructor() { }

  show(){
    this.isLoading.next(true);
  }

  hide(){
    this.isLoading.next(false);
  }

}

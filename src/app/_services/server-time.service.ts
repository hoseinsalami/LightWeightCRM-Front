import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ServerTimeService {

  private serverTimeSubject = new BehaviorSubject<string | null>(null);

  constructor() { }

// متد برای تنظیم زمان از interceptor
  setServerTime(time: string | null): void {
    this.serverTimeSubject.next(time);
  }

  // متد برای دریافت آخرین مقدار فقط یکبار
  getServerTime(): string | null {
    return this.serverTimeSubject.value;
  }

  // متد برای subscribe کردن به تغییرات
  onServerTimeChange(): Observable<string | null> {
    return this.serverTimeSubject.asObservable();
  }

  clear(): void {
    this.serverTimeSubject.next(null);
  }

}

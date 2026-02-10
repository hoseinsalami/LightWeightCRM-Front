import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ServerTimeService {

  private serverTimeSubject = new BehaviorSubject<string | null>(null);
  private clockInterval: any;

  constructor() { }

// متد برای تنظیم زمان از interceptor
  setServerTime(time: string | null): void {
    if (!time) return;
    this.serverTimeSubject.next(time);
    this.startClock();
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


  // Observable برای نمایش به UI
  getServerTime$(): Observable<Date | null> {
    return this.serverTimeSubject.pipe(
      map(ts => ts ? new Date(ts) : null)
    );
  }

  // شروع یا ریست ساعت
  startClock(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }

    this.clockInterval = setInterval(() => {
      const current = this.serverTimeSubject.value;
      if (current) {
        this.serverTimeSubject.next(current + 1000);
      }
    }, 1000);
  }


}

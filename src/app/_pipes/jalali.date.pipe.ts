import { Input, OnChanges, Pipe, PipeTransform, SimpleChanges } from '@angular/core';
import moment from 'jalali-moment';

@Pipe({
    name: 'jalaliDate',
    standalone: true
})
export class JalaliDatePipe implements PipeTransform, OnChanges {
    @Input() format = 'HH:mm:ss _ YYYY/MM/DD '

    ngOnChanges(changes: SimpleChanges): void {

    }
    transform(date: string | undefined | Date | null, format?:'date'|'hour'|'full'|'shortTime'|'custom', customFormat?:string | undefined): string {
        if (typeof date === 'string' && date.startsWith('0001-01-01') || date == '' || date == undefined) {
            return ' فاقد تاریخ ';
        } else {
          if(format == 'custom')
            return moment(date).utc(false).locale('fa').format(customFormat).toString();
          if(format == 'shortTime')
            return moment(date).utc(false).locale('fa').format('HH:mm').toString();
            else if(format == 'hour')
                return moment(date).utc(false).locale('fa').format('HH:mm:ss').toString();
            else if (format == 'date')
                return moment(date).utc(false).locale('fa').format('YYYY/MM/DD ').toString();
            else
                return moment(date).utc(false).locale('fa').format('HH:mm:ss _ YYYY/MM/DD ').toString();

        }
    }


}

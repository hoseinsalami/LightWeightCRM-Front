import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Table } from "primeng/table";
import * as moment from "jalali-moment";
import {NgClass, NgIf} from "@angular/common";
import {OverlayModule} from '@angular/cdk/overlay';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
    MatDateFormats,
    MatNativeDateModule
} from "@angular/material/core";
import { MatInputModule } from '@angular/material/input';
import {ButtonModule} from "primeng/button";
// import { faIR, fr } from 'date-fns/esm/locale';
// import { NgxMatDateFnsModule }  from 'ngx-material-date-fns-adapter';
import { MaterialJalaliMomentAdapterModule } from 'material-jalali-moment-adapter';
import {JalaliMomentDateAdapter} from "./jalali-moment-date-adapter";
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS} from "@angular/material-moment-adapter";

export interface FilterMetadataDate {
  matchMode: string;
  operator: string;
  value: moment.Moment | null;
}
const MAT_DATE_FNS_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'P',
    },
    display: {
        dateInput: 'P',
        monthYearLabel: 'LLLL uuuu',
        dateA11yLabel: 'PP',
        monthYearA11yLabel: 'LLLL uuuu',
    },
};

export const JALALI_MOMENT_FORMATS: MatDateFormats = {
    parse: {
        dateInput: "jYYYY-jMM-jDD"
    },
    display: {
        dateInput: "jYYYY-jMM-jDD",
        monthYearLabel: "jYYYY jMMMM",
        dateA11yLabel: "jYYYY-jMM-jDD",
        monthYearA11yLabel: "jYYYY jMMMM"
    }
};

export const MOMENT_FORMATS: MatDateFormats = {
    parse: {
        dateInput: "l"
    },
    display: {
        dateInput: "l",
        monthYearLabel: "MMM YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "MMMM YYYY"
    }
};

@Component({
    selector: 'app-date-filter',
    templateUrl: './date-filter.component.html',
    styleUrls: ['./date-filter.component.scss'],
    standalone: true,

    imports: [
        NgClass,
        OverlayModule,
        MatDatepickerModule,
        MatFormFieldModule,
        NgIf,
        FormsModule,
        MatNativeDateModule,
        MatInputModule,
        ButtonModule
    ],
    providers: [
        {
            provide: DateAdapter,
            useClass: JalaliMomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        { provide: MAT_DATE_LOCALE, useValue: "fa" }, // en-GB  fr
        {
            provide: MAT_DATE_FORMATS,
            useFactory: locale => {
                if (locale === "fa") {
                    return JALALI_MOMENT_FORMATS;
                } else {
                    return MOMENT_FORMATS;
                }
            },
            deps: [MAT_DATE_LOCALE]
            // useValue: JALALI_MOMENT_FORMATS
        },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
    ]
    // providers: [
    //     // {
    //     //   provide: NGX_MAT_DATEFNS_DATE_ADAPTER_OPTIONS,
    //     //   useValue: {
    //     //     useUtc: true
    //     //   }
    //     // },
    //     { provide: MAT_DATE_LOCALE, useValue:"fa" },
    //     {
    //         provide: MAT_DATE_FORMATS,
    //         useFactory: locale => {
    //             if (locale === "fa") {
    //                 return JALALI_MOMENT_FORMATS;
    //             } else {
    //                 return MOMENT_FORMATS;
    //             }
    //         },
    //         deps: [MAT_DATE_LOCALE]
    //     }
    // ]
})
export class DateFilterComponent implements OnInit, OnChanges {
  // @ts-ignore
  @Input('table') table: TableLazyLoadEvent;
  @Input('field') field: string = '';
  @Output() outtable = new EventEmitter<Table>
  @Input() stateKey :string =''
  isOpen = false
  hasFilter = false;
  showDialog = false
  fieldTime: FilterMetadataDate[] =
    [
      { matchMode: 'after', operator: 'and', value: null },
      { matchMode: 'before', operator: 'and', value: null }
    ];

  constructor() {

  }

  ngOnInit(): void {
    // console.log(this.table);
  }
  ngOnChanges(changes: SimpleChanges) {
    this.fieldTime =  [
      { matchMode: 'after', operator: 'and', value: null },
      { matchMode: 'before', operator: 'and', value: null }
    ];
    this.table.filters[this.field] = this.fieldTime



  }

  setDateFilter() {
    if (this.fieldTime[0].value != null || this.fieldTime[1].value != null) {
      this.hasFilter = true;
    } else {
      this.hasFilter = false;
    }

    this.table.filters[this.field] =
      [
        {
          matchMode: this.fieldTime[0].matchMode,
          operator: this.fieldTime[0].operator,
          value: this.fieldTime[0].value ? this.fieldTime[0].value.toISOString() : null
        },
        {
          matchMode: this.fieldTime[1].matchMode,
          operator: this.fieldTime[1].operator,
          value: this.fieldTime[1].value ? this.fieldTime[1].value.toISOString() : null
        }
      ];

    this.table.stateKey = this.stateKey;
    this.table.onFilter.emit(this.table.filters)
    this.table.saveState();
    // this.outtable.emit(this.table);
    this.table.onLazyLoad.emit(this.table);

  }

  cancel() {
    this.hasFilter = false;
    this.fieldTime[0].value = null
    this.fieldTime[1].value = null;
    this.showDialog = false;
    this.table.filters[this.field] =
      [
        {
          matchMode: this.fieldTime[0].matchMode,
          operator: this.fieldTime[0].operator,
          value: null
        },
        {
          matchMode: this.fieldTime[1].matchMode,
          operator: this.fieldTime[1].operator,
          value: null
        }
      ];
      this.table.stateKey = this.stateKey;
      this.table.onFilter.emit(this.table.filters)
      this.table.saveState();
      // this.outtable.emit(this.table);
      this.table.onLazyLoad.emit(this.table);

  }
  hideDialog() {

  }


}

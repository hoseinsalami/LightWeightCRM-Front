import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../../_services/loading.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {BehaviorSubject, Subject} from "rxjs";

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnInit{

  //loading: Subject<boolean> = this._loading.isLoading;

  loading:boolean = false;
  constructor(private _loading: LoadingService) {
    _loading.isLoading.subscribe((x) =>{
      this.loading = x;
    })
  }

  ngOnInit() {
  }

}

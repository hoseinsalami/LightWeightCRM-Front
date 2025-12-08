import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../_services/authentication.service";
import {Router} from "@angular/router";
import {LoadingService} from "../../_services/loading.service";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {

    constructor(private authService:AuthenticationService,private router:Router, private loading: LoadingService) { }

    ngOnInit(): void {
      this.loading.show()
        this.authService.logout().subscribe(()=>{
          this.loading.hide()
          this.router.navigateByUrl('')
        });
    }
}

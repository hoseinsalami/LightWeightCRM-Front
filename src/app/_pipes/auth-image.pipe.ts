import { Pipe, PipeTransform } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService} from "../_services/authentication.service";

@Pipe({
  name: 'authImage',
  standalone: true
})
export class AuthImagePipe implements PipeTransform {

token:string;

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {
    this.auth.token.subscribe((token)=>{
      this.token = token.token;
    })
  }

  async transform(src: string): Promise<string> {

    const headers = new HttpHeaders({Authorization: `Bearer ${this.token}`});
    try {
      const imageBlob = await this.http.get(src, {headers, responseType: 'blob'}).toPromise();
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        if(imageBlob)
          reader.readAsDataURL(imageBlob) ;
      });
    } catch {
      return 'assets/fallback.png';
    }
  }}

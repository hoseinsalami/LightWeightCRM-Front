// import {Directive, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewContainerRef} from '@angular/core';
// import {routes} from "../app-routing.module";
// import {AuthenticationService} from "../_services/authentication.service";
//
// @Directive({
//   selector: '[appCheckPermission]'
// })
// export class CheckPermissionDirective implements OnInit {
//
//   @Input() routerLink: any;
//   @Input() routerLinks: any;
//   link = '';
//   permissions: string[] | undefined;
//   routes = routes;
//
//   constructor(private el: ElementRef,
//               private renderer: Renderer2,
//               private authService: AuthenticationService) {
//     this.permissions = this.authService.token.getValue().permissions;
//   }
//
//   ngOnInit(): void {
//
//     // console.log(this.routerLinks);
//     if (typeof this.routerLink == "string") {
//       // console.log(this.routerLink);
//       this.link = this.routerLink;
//       this.checkPermission(this.link)
//     } else if (typeof this.routerLink == "object") {
//       // console.log(this.routerLink[0]);
//       // console.table(this.permissions);
//       // this.el.nativeElement.hidden = true;
//       // console.log(this.el.nativeElement);
//       // this.el.nativeElement.style = 'display:none';
//       this.link = this.routerLink[0];
//       this.checkPermission(this.link)
//     } else if (this.routerLinks) {
//       this.link = this.routerLinks;
//       this.checkPermission(this.link)
//     }
//
//   }
//
//   checkPermission(path: string) {
//     const route = this.routes.find(t => {
//       if (t.path == path.slice(1))
//         return true;
//       if (t.path?.includes(':'))
//         if (t.path?.slice(0, -4) == path.slice(1))
//           return true
//       return false;
//     });
//
//   }
// }

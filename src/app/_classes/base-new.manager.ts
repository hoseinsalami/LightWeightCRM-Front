import {MessageService} from "primeng/api";
import {BaseCrudService} from "../_services/base-crud.service";
import {IHaveConstructorInterface} from "../_interfaces/I-have-constructor.interface";
import {GenericType} from "../_types/genericType.type";
import {BaseSaveManager} from "./base-save.manager";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingService} from "../_services/loading.service";

export class BaseNewManager<T extends GenericType<T>> extends BaseSaveManager<T>{

  constructor(  private TClass:IHaveConstructorInterface<T>,
                private service: BaseCrudService,
                private messagesService: MessageService,
                private input: Partial<T> = {},
                private router:Router,
                private activeRoute:ActivatedRoute,
                private loading: LoadingService) {
      super();

      this.oneObject = new TClass(input);
  }

  // set showDialog(value: boolean)
  // {
  //   this._showDialog = value;
  //   if(!value)
  //   {
  //     this.routerS.navigateByUrl(this.returnRoute);
  //   }
  // }
  //
  // get showDialog():boolean
  // {
  //   return this._showDialog;
  // }

    override cancel(url:string = './'){
        this.router.navigate([url], {relativeTo:this.activeRoute.parent});
    }
  override save()
  {
    this.loading.show()
    if(this.oneObject)
    {
       this.BeforeSave.emit(this.oneObject);
      // console.log(this.oneObject);
      this.service.create<T>(this.TClass, this.oneObject).subscribe(()=>{
        this.loading.hide()
        this.OnSuccessfulSave.emit(this.oneObject);
      },() => {
        this.loading.hide()
      });
    }
  }

}

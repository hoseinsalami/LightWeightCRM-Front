import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {BaseCrudService} from "../_services/base-crud.service";
import {IHaveConstructorInterface} from "../_interfaces/I-have-constructor.interface";
import {GenericType} from "../_types/genericType.type";
import {BaseSaveManager} from "./base-save.manager";
import {CustomMessageService} from "../_services/custom-message.service";
import {EventEmitter} from "@angular/core";
import {LoadingService} from "../_services/loading.service";

export class BaseEditManager<T extends GenericType<T>, TUpdate> extends BaseSaveManager<TUpdate>{

    public afterReadEvent:EventEmitter<T> = new EventEmitter<T>();

    constructor(private TClass:IHaveConstructorInterface<T>,
                private mapper:(input:T)=> TUpdate,
                private service: BaseCrudService,
                // private messagesService: MessageService,
                private messagesService: CustomMessageService,
                private routeS: ActivatedRoute,
                private router: Router,
                private loading: LoadingService) {
        super();

    this.routeS.params.subscribe(params => {

        this.oneObject = mapper(new TClass({}));
        if (+params['id']) {
            this.loading.show()
            this.service.getDetail<T>(TClass, +params['id']).subscribe(out => {
              this.oneObject = mapper(out);
              this.loading.hide()
              //this.afterInitialData();
              this.afterReadEvent.emit(out)
        });
      }
    })
  }

  protected afterInitialData() {
  }

  // set showDialog(value: boolean) {
  //   this._showDialog = value;
  //   //console.log(value)
  //   if (!value) {
  //     this.routerS.navigateByUrl(this.returnRoute).then(() => {
  //     });
  //   }
  // }
  //
  // get showDialog(): boolean {
  //   return this._showDialog;
  // }

    override cancel(url:string = './'){
        this.router.navigate([url], {relativeTo:this.routeS.parent});
    }

    override save() {
    this.isSending = true;
    this.loading.show()
    if (this.oneObject) {
      this.BeforeSave.emit(this.oneObject);
      this.service.update(this.oneObject).subscribe(out => {
        this.messagesService.showSuccess("عملیات با موفقیت انجام شد");
        this.isSending = false;
        this.loading.hide()
        this.OnSuccessfulSave.emit(this.oneObject);
      }, error => {
        this.isSending = false;
        this.loading.hide()
      });
    }
  }
}

import {Component, OnInit} from '@angular/core';
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {LoadingService} from "../../../../_services/loading.service";
import {CustomMessageService} from "../../../../_services/custom-message.service";
import {
  CreatePropertyDTO,
  DocumentModelType,
  PropertyTypeEnum,
  PropertyTypeEnum2LabelMapping
} from "../../../_types/document.type";
import {Utilities} from "../../../../_classes/utilities";
import {DocumentService} from "../../../_services/document.service";
import {FormControl} from "@angular/forms";

@Component({
  template: '',
})
export class BaseDocumentDetailComponent implements OnInit{


  propertyOptions: any;
  propertyTypeEnum = PropertyTypeEnum;
  isEnglish:boolean = false;

  parameters:{title?:string}[] = [];
  isEnglishError: { [field: string]: boolean } = {};

  docData = []


  startDate!: string;
  startDateTimeControl = new FormControl();
  constructor(
    private docService: DocumentService,
    protected manager: BaseSaveManager<DocumentModelType>,
    protected loading: LoadingService,
  ) {
    this.propertyOptions = Utilities.ConvertEnumToKeyPairArray(PropertyTypeEnum, PropertyTypeEnum2LabelMapping);
  }

  ngOnInit() {
    this.getAllDocument()
  }

  getAllDocument(){
    this.loading.show();
    this.docService.getDocItems<{id:number, title:string, name:string }>({},'/list',{}).subscribe({
      next: (out) => {
        this.loading.hide();
        out.items.forEach(t => this.docData.push(t));
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  addNewProperties(){
    this.manager.oneObject.properties.unshift(new CreatePropertyDTO({}))
  }

  removeProperties(index:number){
    this.manager.oneObject.properties.splice(index, 1)
  }

  addNewParameter(){
    this.parameters.push({title:null})
  }

  removeParamenter(index:number){
    this.parameters.splice(index, 1)
  }


  onChangeProperty(item){
    if (item.value == this.propertyTypeEnum.SingleSelect || item.value == this.propertyTypeEnum.MultiSelect){
      this.parameters =[{title:null}]
    }
  }

  allowOnlyEnglish(event: KeyboardEvent, fieldName?:string){
    const char = event.key;
    const regex = /^[a-zA-Z0-9\s]*$/;
    if (!regex.test(char)){
      this.isEnglishError[fieldName] = true;
      event.preventDefault()
    } else{
      this.isEnglishError[fieldName] = false;
    }
  }

  initialStartDatePicker(event: any) {
    this.startDate = event.gregorian;
  }

  selectStartDate(event: any) {
    this.startDate = event.gregorian
  }


  get hasTitleInParameters(): boolean {
    return this.parameters?.some(p => !!p?.title);
  }

  onCaptionChange(index: number) {
    this.manager.oneObject.properties.forEach((item,i)=>{
      item.isCaption = i === index;
    })
  }


}

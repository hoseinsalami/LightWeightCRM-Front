import { Component } from '@angular/core';
import {BaseListComponent} from "../../../../shared/base-list/base-list.component";
import {ToolbarModule} from "primeng/toolbar";
import {ConfirmationService, MessageService, SharedModule} from "primeng/api";
import {ButtonModule} from "primeng/button";
import {TableModule, TableRowSelectEvent} from "primeng/table";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {DialogModule} from "primeng/dialog";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {JalaliDatePipe} from "../../../../_pipes/jalali.date.pipe";
import {SurveyService} from "../../../_services/survey.service";
import {LoadingService} from "../../../../_services/loading.service";
import {CreateQuestionOptionDTO, SurveyQuestions} from "../../../_types/survey.type";
import {TableLazyLoadEvent, TableRowReorderEvent} from "primeng/table/table.interface";
import {FieldsetModule} from "primeng/fieldset";
import {InputNumber, InputNumberModule} from "primeng/inputnumber";
import {KeyFilterModule} from "primeng/keyfilter";
import {CommonModule} from "@angular/common";
import {BaseSaveManager} from "../../../../_classes/base-save.manager";
import {Table} from "primeng/table/table";

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    SharedModule,
    ButtonModule,
    TableModule,
    RouterLink,
    DialogModule,
    FormsModule,
    InputTextModule,
    JalaliDatePipe,
    FieldsetModule,
    InputNumberModule,
    KeyFilterModule
  ]
})
export class QuestionsComponent extends BaseListComponent<{id:number, title:number}> {

  copyList = []
  sortList = []
  showDialogTable:boolean = false

  id:string;
  showDialog:boolean = false
  oneObject:SurveyQuestions = new SurveyQuestions({options:[ new CreateQuestionOptionDTO({})]})

  options: { text: string; score: number }[] = [
    { text: '', score: 0 }
  ];

  lastLazyEvent!: TableLazyLoadEvent;
  constructor(
    private surveyService: SurveyService,
    confirmationService: ConfirmationService,
    messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private loading: LoadingService
  ) {
    super(surveyService, confirmationService, messageService);
    this.id = this.route.snapshot.params['id']
  }


  onSave(id?:number) {
    this.loading.show();

    if (!id) {
      this.oneObject.survayId = +this.id;
    }

    const request$ = id
      ? this.surveyService.putQuestion(this.oneObject)
      : this.surveyService.postQuestion(this.oneObject);

    request$.subscribe({
      next: () => {
        this.loading.hide();
        this.showDialog = false;
        this.getListOfQuestion(this.lastLazyEvent);
      },
      error: () => {
        this.loading.hide();
      }
    });
  }

  getListOfQuestion(event:TableLazyLoadEvent){
    this.lastLazyEvent = event;
    this.loading.show();
    this.surveyService.getQuestions(+this.id, event.first, event.rows).subscribe({
      next: (out) =>{
        this.loading.hide();
        this.tableLoading = false
        this.many = out.items
        this.copyList = [...this.many]
      },
      error: (err) =>{
        this.loading.hide();
        this.tableLoading = false;
      }
    })
  }

  onDeleteQuestion(id:number){
    this.confirmationService.confirm({
      header: 'حذف',
      message: 'آیا از انجام حذف اطمینان دارید؟',

      accept: () => {
        this.loading.show();
        this.surveyService.deleteQuestion(id).subscribe({
          next:(out) =>{
            this.loading.hide();
            this.getListOfQuestion(this.lastLazyEvent)
          },
          error: (err) =>{
            this.loading.hide();
          }
        })
      },
    });

  }



  addOption() {
    this.oneObject.options.unshift(new CreateQuestionOptionDTO({}));
  }

  removeOption(index: number) {
    if (this.oneObject.options && this.oneObject.options.length > 1) {
      this.oneObject.options.splice(index, 1);
    }
  }

  decreaseScore(option:any){
    option.score = (option.score ?? 0) + 1;
  }

  increaseScore(option:any){
    if ((option.score ?? 0) > 0) {
      option.score--;
    }
  }

  isShowDialog(id?:number) {
    if (id){
      this.loading.show();
      this.surveyService.getOneQuestion(id).subscribe({
        next:(out) =>{
          this.loading.hide();
          this.oneObject = out
        },
        error: (err) =>{
          this.loading.hide();
        }
      })
    } else {
      this.oneObject = new SurveyQuestions({options:[ new CreateQuestionOptionDTO({})]})
    }
    this.showDialog = true;
  }

  onShowDialogSort(){
    this.loading.show();
    this.surveyService.getQuestions(+this.id).subscribe({
      next: (out) =>{
        this.loading.hide();
        this.showDialogTable = true
        this.tableLoading = false;
        this.sortList = out.items;
        // this.copyList = [...this.many];
      },
      error: (err) =>{
        this.loading.hide();
        this.tableLoading = false;
        this.showDialogTable = false;
      }
    })
  }

  onRowReorder(event: TableRowReorderEvent) {
    console.log(event);
    const ids = this.sortList.map(item => item.id);

    const input = {
      survayId: +this.id,
      ids: ids
    }
    console.log(input);
    this.surveyService.putChangeOrderQuestions(input).subscribe({
      next: (out) =>{
        this.loading.hide();
      },
      error: (err) =>{
        this.loading.hide();
      }
    })
  }

  onSubmitDialogTable(){
    this.getListOfQuestion(this.lastLazyEvent);
    this.showDialogTable = false;
  }

}

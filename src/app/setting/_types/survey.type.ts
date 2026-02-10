import {GenericType} from "../../_types/genericType.type";

export class SurveyType extends GenericType<SurveyType>{
  title?: string;
  negativeScoreThreshold?: number;

  constructor(model:Partial<SurveyType>) {
    super(model);
  }

}

export class SurveyQuestions extends GenericType<SurveyQuestions>{
  survayId?: number;
  title?: string;
  options?: CreateQuestionOptionDTO[];
  constructor(model?: Partial<SurveyQuestions>) {
    super(model);
    if (model.options){
      this.options = model.options.map(item => { return new CreateQuestionOptionDTO(item)})
    }
  }
}

export class CreateQuestionOptionDTO extends GenericType<CreateQuestionOptionDTO>{
  title?: string;
  score?: number = 0;

  constructor(model?: Partial<CreateQuestionOptionDTO>) {
    super(model);
  }
}


export class ShowAllQuestions extends GenericType<ShowAllQuestions>{

  title?:string;
  questions?:SurveyQuestions[]

  constructor(model?:Partial<ShowAllQuestions>) {
    super(model);
    if (model.questions){
      this.questions = model.questions.map(item => { return new SurveyQuestions(item)});
    }
  }
}

export interface IChangeOrderQuestions{
  questionId?: number;
  order?: number;
}

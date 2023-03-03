export interface AnswerTotal {
  [key: string]: number;
}

export interface QuestionResult {
  type: string;
  questionTitle: string;
  responseCount: number;
  answerTotal: AnswerTotal;
}

export interface QuestionResultDictionary {
  [key: number]: QuestionResult;
}

export interface Result {
  formTitle: string;
  totalResponseCount: number;
  acceptResponse: boolean;
  questionResultDict: QuestionResultDictionary;
}

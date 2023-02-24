import { questionRequestDto } from "./question-dto.interface";

export class FormRequestDto {
  title: string;
  description: string;
  category: string;
  questionList: Array<questionRequestDto>;
  acceptResponse: boolean;
  onBoard: boolean;
  loginRequired: boolean;
  responseModifiable: boolean;
}

export class questionRequestDto {
  questionId: number;
  page: number;
  type: string;
  title: string;
  option: Array<string>;
  essential: boolean;
  etcAdded: boolean;
}

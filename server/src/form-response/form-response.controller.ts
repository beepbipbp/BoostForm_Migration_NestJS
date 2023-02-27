import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FormResponseService } from "./form-response.service";
import { AnswerRequestDto } from "./interfaces/answer-dto.interface";

@Controller("api/responses")
export class FormResponseController {
  constructor(private readonly formResponseService: FormResponseService) {}

  @Get("isSubmitted/:formId")
  async checkFormResponseExistence(@Body("userId") userId: string, @Param("formId") formId: string) {
    const result = await this.formResponseService.checkFormResponseExistence(userId, formId);

    return result;
  }

  @Post(":formId")
  async saveFormResponse(
    @Body("userId") userId: string,
    @Body("answerList") answersRequestDto: AnswerRequestDto[],
    @Param("formId") formId: string,
  ) {
    const result = await this.formResponseService.saveFormResponse(userId, formId, answersRequestDto);

    return result;
  }
}

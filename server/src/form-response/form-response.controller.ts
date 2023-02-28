import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { FormResponseService } from "./form-response.service";
import { AnswerRequestDto } from "./interfaces/answer-dto.interface";

@Controller("api/responses")
export class FormResponseController {
  constructor(private readonly formResponseService: FormResponseService) {}

  @Get("isSubmitted/:formId")
  async checkFormResponseExistence(@Param("formId") formId: string, @Body("userId") userId: string) {
    const result = await this.formResponseService.checkFormResponseExistence(userId, formId);

    return result;
  }

  @Post(":formId")
  async saveFormResponse(
    @Param("formId") formId: string,
    @Body("userId") userId: string | undefined,
    @Body("answerList") answersRequestDto: AnswerRequestDto[],
  ) {
    const result = await this.formResponseService.saveFormResponse(userId, formId, answersRequestDto);

    return result;
  }

  @Get(":formId/:formResponseId")
  async revistFormResponse(
    @Param("formId") formId: string,
    @Param("formResponseId") formResponseId: string,
    @Body("userId") userId: string,
  ) {
    const result = await this.formResponseService.getFormResponse(userId, formId, formResponseId);

    return result;
  }

  @Patch(":formId/:formResponseId")
  async updateFormResponse(
    @Param("formResponseId") formResponseId: string,
    @Body("answerList") answersRequestDto: AnswerRequestDto[],
  ) {
    const result = await this.formResponseService.updateFormResponse(formResponseId, answersRequestDto);

    return result;
  }
}

import { Body, Controller, Get, Param } from "@nestjs/common";
import { FormResponseService } from "./form-response.service";

@Controller("api/responses")
export class FormResponseController {
  constructor(private readonly formResponseService: FormResponseService) {}

  @Get("isSubmitted/:formId")
  async checkFormResponseExistence(@Body("userId") userId: string, @Param("formId") formId: string) {
    const result = await this.formResponseService.checkAnswerExistence(userId, formId);

    return result;
  }
}

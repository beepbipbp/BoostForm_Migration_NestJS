import { Controller, Get, Param } from "@nestjs/common";
import { ResultService } from "./result.service";

@Controller("api/results")
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Get("/:formId")
  async getResult(@Param("formId") formId: string) {
    const result = await this.resultService.getResult(formId);

    return result;
  }
}

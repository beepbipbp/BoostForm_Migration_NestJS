import { BadRequestException, Body, Controller, Get, Query, UnauthorizedException } from "@nestjs/common";
import { FormService } from "./form.service";

@Controller("form")
export class FormController {
  constructor(private readonly formService: FormService) {}
  @Get()
  async getFormList(@Query("cursor") cursor: string, @Body("userId") userId: string) {
    if (!userId) {
      throw new UnauthorizedException("login is required");
    }
    if (!cursor) {
      throw new BadRequestException("cursor is undefined");
    }

    const result = await this.formService.getFormList(userId, cursor);

    return result;
  }
}

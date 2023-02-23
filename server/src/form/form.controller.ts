import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UnauthorizedException,
} from "@nestjs/common";
import { FormService } from "./form.service";

@Controller("api/forms")
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

  @Post()
  @HttpCode(201)
  async createNewForm(@Body("userId") userId: string) {
    if (!userId) {
      throw new UnauthorizedException("login is required");
    }

    const result = await this.formService.createNewForm(userId);

    return result;
  }
}

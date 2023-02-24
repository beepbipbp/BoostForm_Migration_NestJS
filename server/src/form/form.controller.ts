import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";
import { FormService } from "./form.service";
import { FormRequestDto } from "./interfaces/form-dto.interface";

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

  @Get(":formId")
  async getForm(@Param("formId") formId: string) {
    const result = await this.formService.getForm(formId);
    return result;
  }

  @Patch(":formId")
  async updateForm(@Param("formId") formId: string, @Body() formRequestDto: FormRequestDto, @Res() res: Response) {
    await this.formService.updateForm(formId, formRequestDto);

    res.end();

    this.formService.updateFormToRedis(formId);
  }

  @Delete(":formId")
  @HttpCode(204)
  async deleteForm(@Param("formId") formId: string, @Res() res: Response) {
    await this.formService.deleteForm(formId);

    res.end();
  }
}

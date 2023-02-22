import { Body, Controller, Get, HttpException, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { UserService } from "./user.service";

@Controller("api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("redirect")
  redirect(@Res() res: Response) {
    if (!process.env.GITHUB_AUTHORIZE_URL) {
      return "";
    }
    res.status(301).redirect(process.env.GITHUB_AUTHORIZE_URL);
  }

  @Get("login")
  async logIn(@Query("code") code: string, @Res() res: Response) {
    if (!code) {
      throw new HttpException("code is empty", 400);
    }

    const tokens = await this.userService.login(code);

    res
      .cookie("accessToken", tokens.accessToken)
      .cookie("refreshToken", tokens.refreshToken, { httpOnly: true })
      .redirect(`${process.env.ORIGIN_URL}/myForms`);
  }

  @Get("test")
  async test(@Body("userId") userId: string) {
    return `hello ${userId}`;
  }
}

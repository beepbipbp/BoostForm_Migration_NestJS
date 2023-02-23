import { BadRequestException, Body, Controller, Delete, Get, HttpException, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { UserService } from "./user.service";

@Controller("api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("redirect")
  redirect(@Res() res: Response) {
    res.status(301).redirect(process.env.GITHUB_AUTHORIZE_URL);
  }

  @Get("login")
  async logIn(@Query("code") code: string, @Res() res: Response) {
    if (!code) {
      throw new BadRequestException("code is empty");
    }

    const tokens = await this.userService.login(code);

    res
      .cookie("accessToken", tokens.accessToken)
      .cookie("refreshToken", tokens.refreshToken, { httpOnly: true })
      .redirect(`${process.env.ORIGIN_URL}/myForms`);
  }

  @Get()
  async getUser(@Body("userId") userId: string) {
    const user = await this.userService.getUser(userId);

    return user;
  }

  @Delete("logout")
  async logOut(@Body("userId") userId: string, @Res() res: Response) {
    await this.userService.logOut(userId);

    res.clearCookie("accessToken").clearCookie("refreshToken").end();
  }
}

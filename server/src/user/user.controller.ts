import { Controller, Get, HttpException, Query, Redirect, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("api/users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("redirect")
  @Redirect(process.env.GITHUB_AUTHORIZE_URL, 301)
  redirect() {
    if (!process.env.GITHUB_AUTHORIZE_URL) {
      return "";
    }
  }

  @Get("login")
  async logIn(@Query("code") code: string) {
    if (!code) {
      throw new HttpException("code is empty", 400);
    }

    await this.userService.login(code);
  }
}

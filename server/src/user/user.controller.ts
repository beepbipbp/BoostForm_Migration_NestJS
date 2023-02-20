import { Controller, Get, Redirect } from "@nestjs/common";

@Controller("api/users")
export class UserController {
  @Get("redirect")
  @Redirect(process.env.GITHUB_AUTHORIZE_URL, 301)
  redirect() {
    if (!process.env.GITHUB_AUTHORIZE_URL) {
      return "";
    }
  }
}

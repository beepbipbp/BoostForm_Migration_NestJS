import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  async login(code: string) {
    const githubAccessToken = await this.issueGithubAccessToken(code);
    const userName = await this.getGithubUserName(githubAccessToken);
  }

  async issueGithubAccessToken(code: string) {
    const option = { headers: { accept: "application/json" } };
    const body = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    };

    const githubAccessToken = await this.httpService.axiosRef
      .post("https://github.com/login/oauth/access_token", body, option)
      .then((response) => response.data.access_token)
      .catch((error) => {
        throw new HttpException("failed to get github access token", 401);
      });

    return githubAccessToken;
  }

  async getGithubUserName(githubAccessToken: string) {
    const userName = await this.httpService.axiosRef
      .get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${githubAccessToken}` },
      })
      .then((response) => response.data.login)
      .catch((error) => {
        throw new HttpException("failed to get github id", 401);
      });

    return userName;
  }
}

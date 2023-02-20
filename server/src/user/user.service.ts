import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async login(code: string) {
    const githubAccessToken = await this.issueGithubAccessToken(code);
    const userName = await this.getGithubUserName(githubAccessToken);
    let user = await this.userRepository.findUserByName(userName);

    if (!user) {
      user = await this.userRepository.signUp(userName);
    }
    if (!user || typeof user.id !== "string") {
      throw new HttpException("mongodb error", 500);
    }

    const accessToken = this.generateToken(user.id, "1m");
    const refreshToken = this.generateToken(user.id, "7d");

    user.refresh_token = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
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

  generateToken(userId: string, expiresIn: string) {
    const token = this.jwtService.sign({ id: userId }, { expiresIn });

    return token;
  }
}

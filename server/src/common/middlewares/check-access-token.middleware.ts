import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AuthMiddleware } from "./auth.middleware";

@Injectable()
export class CheckAccessTokenMiddleware implements NestMiddleware {
  constructor(private readonly authMiddleware: AuthMiddleware) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      next();
    } else {
      this.authMiddleware.use(req, res, next);
    }
  }
}

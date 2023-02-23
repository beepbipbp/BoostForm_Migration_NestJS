import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { Redis } from "ioredis";

@Injectable()
export class FormCachingMiddleware implements NestMiddleware {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  use(req: Request, res: Response, next: NextFunction) {}
}

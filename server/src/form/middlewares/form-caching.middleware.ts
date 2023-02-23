import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { Redis } from "ioredis";

@Injectable()
export class FormCachingMiddleware implements NestMiddleware {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { formId } = req.params;
    const cachedForm = await this.redis.get(`form:${formId}`);

    if (cachedForm) {
      const form = JSON.parse(cachedForm);
      res.status(200).json(form);

      this.redis.expire(`form:${formId}`, 300);
    } else {
      next();
    }
  }
}

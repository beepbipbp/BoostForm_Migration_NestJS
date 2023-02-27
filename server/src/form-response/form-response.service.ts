import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { FormResponseRepository } from "./form-response.repository";
import { FormResponse } from "./schemas/form-response.schema";

@Injectable()
export class FormResponseService {
  constructor(
    private readonly formResponseRepository: FormResponseRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async checkAnswerExistence(userId: string, formId: string) {
    const response = await this.formResponseRepository.findFormResponseByUserId(userId, formId);

    if (!response) {
      const responseListInRedis = await this.redis.hgetall("response");

      for (const responseId in responseListInRedis) {
        const responseInRedis: FormResponse = JSON.parse(responseListInRedis[responseId]);
        if (responseInRedis.respondent_id === userId && responseInRedis.form_id === formId) {
          return { responseId };
        }
      }
    }

    if (response) {
      return { responseId: `${response._id}` };
    }

    return { responseId: null };
  }
}

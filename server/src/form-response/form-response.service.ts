import { InjectRedis } from "@liaoliaots/nestjs-redis";
import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { FormResponseRepository } from "./form-response.repository";
import { AnswerRequestDto } from "./interfaces/answer-dto.interface";
import { Answer } from "./schemas/answer.schema";
import { FormResponse } from "./schemas/form-response.schema";

@Injectable()
export class FormResponseService {
  constructor(
    private readonly formResponseRepository: FormResponseRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async checkFormResponseExistence(userId: string, formId: string) {
    const formResponse = await this.formResponseRepository.findFormResponseByUserId(userId, formId);

    if (!formResponse) {
      const formResponseListInRedis = await this.redis.hgetall("form-response");

      for (const formResponseId in formResponseListInRedis) {
        const formResponseInRedis: FormResponse = JSON.parse(formResponseListInRedis[formResponseId]);

        if (formResponseInRedis.respondent_id === userId && formResponseInRedis.form_id === formId) {
          return { responseId: formResponseId };
        }
      }
    }

    if (formResponse) {
      return { responseId: `${formResponse._id}` };
    }

    return { responseId: null };
  }

  async saveFormResponse(userId: string, formId: string, answersRequestDto: AnswerRequestDto[]) {
    const answers = answersRequestDto
      ? answersRequestDto.map((answerRequestDto) => {
          return {
            question_id: answerRequestDto.questionId,
            selected_options: answerRequestDto.answer,
          } as Answer;
        })
      : [];

    const newResponse = this.formResponseRepository.makeNewFormResponse(userId, formId, answers);
    const newResponseForRedis = new Object();
    newResponseForRedis[newResponse.id] = JSON.stringify(newResponse);

    await this.redis.hset("form-response", newResponseForRedis);
    await this.redis.hincrby("count", formId, 1);

    return { responseId: newResponse.id };
  }
}

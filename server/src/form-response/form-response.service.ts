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
        const formResponse: FormResponse = JSON.parse(formResponseListInRedis[formResponseId]);

        if (formResponse.respondent_id === userId && formResponse.form_id === formId) {
          return { responseId: formResponseId };
        }
      }
    }

    if (formResponse) {
      return { responseId: `${formResponse._id}` };
    }

    return { responseId: null };
  }

  async saveFormResponse(userId: string | undefined, formId: string, answersRequestDto: AnswerRequestDto[]) {
    const answers = answersRequestDto
      ? answersRequestDto.map((answerRequestDto) => {
          return {
            question_id: answerRequestDto.questionId,
            selected_options: answerRequestDto.answer,
          } as Answer;
        })
      : [];

    const newFormResponse = this.formResponseRepository.makeNewFormResponse(userId, formId, answers);
    const newResponseForRedis = new Object();
    newResponseForRedis[newFormResponse.id] = JSON.stringify(newFormResponse);

    await this.redis.hset("form-response", newResponseForRedis);
    await this.redis.hincrby("count", formId, 1);

    return { responseId: newFormResponse.id };
  }

  async getFormResponse(userId: string, formId: string, formResponseId: string) {
    let formResponse: FormResponse;

    // redis에서 이전에 제출한 응답지 찾기
    let formResponseInRedis = await this.redis.hget("form-response-update", formResponseId);
    if (!formResponseInRedis) {
      formResponseInRedis = await this.redis.hget("form-response", formResponseId);
    }

    // 만약 redis에서 응답지를 찾았다면 JSON.parse로 변환
    // 찾지 못했다면 DB에서 다시 찾음
    if (formResponseInRedis) {
      formResponse = JSON.parse(formResponseInRedis);
    } else {
      formResponse = await this.formResponseRepository.findFormResponse(formResponseId);
    }

    const answersForResponse = formResponse.answers
      ? formResponse.answers.map((a) => {
          return {
            questionId: a.question_id,
            answer: a.selected_options,
          };
        })
      : [];

    return { userId, formId, answerList: answersForResponse };
  }

  async updateFormResponse(formResponseId: string, answersRequestDto: AnswerRequestDto[]) {
    const answers = answersRequestDto
      ? answersRequestDto.map((answerRequestDto) => {
          return {
            question_id: answerRequestDto.questionId,
            selected_options: answerRequestDto.answer,
          } as Answer;
        })
      : [];

    const answersForRedis = new Object();
    answersForRedis[formResponseId] = JSON.stringify({ answers });

    await this.redis.hset("form-response-update", answersForRedis);

    return { responseId: formResponseId };
  }
}

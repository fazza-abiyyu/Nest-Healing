import {Answer} from '@prisma/client';

export class CreateQuizAnswerDto {
  question_id: number;
  answer: Answer;
  value: number;
}

export class UpdateQuizAnswerDto {
  answer: Answer;
  value: number;
}

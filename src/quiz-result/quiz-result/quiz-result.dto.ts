import {Answer} from '@prisma/client';

export class CreateQuizResultDto {
  user_id: number;
  quiz_id: number;
  answers: {question_id: number; answer: Answer}[];
}

import {Answer} from '@prisma/client';

export interface QuizQuestionData {
  quiz_id: number;
  question: string;
  answers: Array<{id?: number; answer: Answer; value: number}>;
}

import {Injectable} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';
import {QuizQuestionData} from './question-quiz.dto';
import {QuizQuestion} from '@prisma/client';

@Injectable()
export class QuestionQuizService {
  constructor(private prisma: PrismaService) {}

  async createQuestion(data: QuizQuestionData): Promise<QuizQuestion> {
    return this.prisma.quizQuestion.create({
      data: {
        quiz_id: data.quiz_id,
        question: data.question,
        answers: {
          create: data.answers.map((answer) => ({
            answer: answer.answer,
            value: answer.value,
          })),
        },
      },
      include: {answers: true},
    });
  }

  async getQuestionsByQuiz(quiz_id: number): Promise<QuizQuestion[]> {
    return this.prisma.quizQuestion.findMany({
      where: {quiz_id},
      include: {answers: true},
    });
  }

  async updateQuestion(
    id: number,
    data: QuizQuestionData,
  ): Promise<QuizQuestion> {
    return this.prisma.quizQuestion.update({
      where: {id},
      data: {
        question: data.question,
        answers: {
          deleteMany: {},
          create: data.answers.map((answer) => ({
            answer: answer.answer,
            value: answer.value,
          })),
        },
      },
      include: {answers: true},
    });
  }

  async deleteQuestion(id: number): Promise<QuizQuestion> {
    return this.prisma.quizQuestion.delete({
      where: {id},
    });
  }
}

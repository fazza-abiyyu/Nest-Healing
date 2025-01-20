import {Injectable} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';
import {Quiz} from '@prisma/client';

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  async createQuiz(title: string, description: string): Promise<Quiz> {
    return this.prisma.quiz.create({
      data: {
        title,
        description,
      },
    });
  }

  async getAllQuizzes(): Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      include: {questions: true, quizResults: true},
    });
  }

  async getQuizById(id: number): Promise<Quiz | null> {
    return this.prisma.quiz.findUnique({
      where: {id},
      include: {questions: true, quizResults: true},
    });
  }

  async updateQuiz(
    id: number,
    title: string,
    description: string,
  ): Promise<Quiz> {
    return this.prisma.quiz.update({
      where: {id},
      data: {
        title,
        description,
      },
    });
  }

  async deleteQuiz(id: number): Promise<Quiz> {
    return this.prisma.quiz.delete({
      where: {id},
    });
  }
}

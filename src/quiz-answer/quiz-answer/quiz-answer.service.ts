import {Injectable} from '@nestjs/common';
import {QuizAnswer} from '@prisma/client';
import {CreateQuizAnswerDto, UpdateQuizAnswerDto} from './quiz-answer.dto';
import {PrismaService} from '../../prisma/prisma.service';

@Injectable()
export class QuizAnswerService {
  constructor(private prisma: PrismaService) {}

  async createQuizAnswer(data: CreateQuizAnswerDto): Promise<QuizAnswer> {
    return this.prisma.quizAnswer.create({
      data,
    });
  }

  async getAllQuizAnswers(): Promise<QuizAnswer[]> {
    return this.prisma.quizAnswer.findMany();
  }

  async getQuizAnswerById(id: number): Promise<QuizAnswer | null> {
    return this.prisma.quizAnswer.findUnique({
      where: {id},
    });
  }

  async updateQuizAnswer(
    id: number,
    data: UpdateQuizAnswerDto,
  ): Promise<QuizAnswer> {
    return this.prisma.quizAnswer.update({
      where: {id},
      data,
    });
  }

  async deleteQuizAnswer(id: number): Promise<QuizAnswer> {
    return this.prisma.quizAnswer.delete({
      where: {id},
    });
  }
}

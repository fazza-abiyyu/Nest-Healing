import {Injectable} from '@nestjs/common';
import {CreateQuizResultDto} from './quiz-result.dto';
import {PrismaService} from '../../prisma/prisma.service';
import {QuizScoreService} from '../../utils/quiz-score/quiz-score.service';
import {QuizResult} from '../../utils/quiz-score/quiz-score.dto';

@Injectable()
export class QuizResultService {
  constructor(
    private prisma: PrismaService,
    private quizScoreService: QuizScoreService,
  ) {}

  async createQuizResult(data: CreateQuizResultDto): Promise<QuizResult> {
    const {score, category, message} =
      await this.quizScoreService.calculateQuizScoreAndCategory(data.answers);

    return this.prisma.userQuizResult.create({
      data: {
        user_id: data.user_id,
        quiz_id: data.quiz_id,
        answers: JSON.stringify(data.answers),
        score,
        category,
        message,
      },
    });
  }

  async getAllQuizResults(): Promise<QuizResult[]> {
    return this.prisma.userQuizResult.findMany();
  }

  async getQuizResultById(id: number): Promise<QuizResult | null> {
    return this.prisma.userQuizResult.findUnique({
      where: {id},
    });
  }

  async deleteQuizResult(id: number): Promise<QuizResult> {
    return this.prisma.userQuizResult.delete({
      where: {id},
    });
  }
}

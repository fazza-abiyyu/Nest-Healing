import {Module} from '@nestjs/common';
import {QuizResultController} from './quiz-result/quiz-result.controller';
import {QuizResultService} from './quiz-result/quiz-result.service';
import {PrismaService} from '../prisma/prisma.service';
import {QuizScoreService} from '../utils/quiz-score/quiz-score.service';

@Module({
  controllers: [QuizResultController],
  providers: [QuizResultService, PrismaService, QuizScoreService],
})
export class QuizResultModule {}

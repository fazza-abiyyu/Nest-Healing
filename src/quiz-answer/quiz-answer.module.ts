import {Module} from '@nestjs/common';
import {QuizAnswerController} from './quiz-answer/quiz-answer.controller';
import {QuizAnswerService} from './quiz-answer/quiz-answer.service';
import {PrismaService} from '../prisma/prisma.service';
@Module({
  controllers: [QuizAnswerController],
  providers: [QuizAnswerService, PrismaService],
})
export class QuizAnswerModule {}

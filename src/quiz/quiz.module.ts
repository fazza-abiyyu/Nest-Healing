import {Module} from '@nestjs/common';
import {QuizController} from './quiz/quiz.controller';
import {QuizService} from './quiz/quiz.service';
import {PrismaService} from '../prisma/prisma.service';

@Module({
  controllers: [QuizController],
  providers: [QuizService, PrismaService],
})
export class QuizModule {}

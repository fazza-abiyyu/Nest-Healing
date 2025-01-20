import {Module} from '@nestjs/common';
import {QuestionQuizController} from './question-quiz/question-quiz.controller';
import {QuestionQuizService} from './question-quiz/question-quiz.service';
import {PrismaService} from '../prisma/prisma.service';

@Module({
  controllers: [QuestionQuizController],
  providers: [QuestionQuizService, PrismaService],
})
export class QuestionQuizModule {}

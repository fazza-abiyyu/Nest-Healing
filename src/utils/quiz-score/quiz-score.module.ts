import { Module } from '@nestjs/common';
import { QuizScoreService } from './quiz-score.service';

@Module({
  providers: [QuizScoreService]
})
export class QuizScoreModule {}

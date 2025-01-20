import {Controller, Post, Get, Delete, Param, Body} from '@nestjs/common';
import {QuizResultService} from './quiz-result.service';
import {CreateQuizResultDto} from './quiz-result.dto';
import {QuizResult} from '../../utils/quiz-score/quiz-score.dto';

@Controller('api/auth/quiz-results')
export class QuizResultController {
  constructor(private readonly quizResultService: QuizResultService) {}

  @Post()
  async createQuizResult(
    @Body() data: CreateQuizResultDto,
  ): Promise<QuizResult> {
    return this.quizResultService.createQuizResult(data);
  }

  @Get()
  async getAllQuizResults(): Promise<QuizResult[]> {
    return this.quizResultService.getAllQuizResults();
  }

  @Get(':id')
  async getQuizResultById(@Param('id') id: number): Promise<QuizResult | null> {
    return this.quizResultService.getQuizResultById(id);
  }

  @Delete(':id')
  async deleteQuizResult(@Param('id') id: number): Promise<QuizResult> {
    return this.quizResultService.deleteQuizResult(id);
  }
}

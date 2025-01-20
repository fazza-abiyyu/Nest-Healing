import {Controller, Post, Get, Put, Delete, Param, Body} from '@nestjs/common';
import {QuestionQuizService} from './question-quiz.service';
import {QuizQuestion} from '@prisma/client';
import {QuizQuestionData} from './question-quiz.dto';

@Controller('api/auth/quiz-questions')
export class QuestionQuizController {
  constructor(private readonly questionQuizService: QuestionQuizService) {}

  @Post()
  async createQuestion(@Body() data: QuizQuestionData): Promise<QuizQuestion> {
    return this.questionQuizService.createQuestion(data);
  }

  @Get(':quiz_id')
  async getQuestionsByQuiz(
    @Param('quiz_id') quiz_id: number,
  ): Promise<QuizQuestion[]> {
    return this.questionQuizService.getQuestionsByQuiz(quiz_id);
  }

  @Put(':id')
  async updateQuestion(
    @Param('id') id: number,
    @Body() data: QuizQuestionData,
  ): Promise<QuizQuestion> {
    return this.questionQuizService.updateQuestion(id, data);
  }

  @Delete(':id')
  async deleteQuestion(@Param('id') id: number): Promise<QuizQuestion> {
    return this.questionQuizService.deleteQuestion(id);
  }
}

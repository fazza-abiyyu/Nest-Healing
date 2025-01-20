import {Controller, Post, Get, Put, Delete, Param, Body} from '@nestjs/common';
import {QuizService} from './quiz.service';
import {Quiz} from '@prisma/client';

@Controller('api/auth/quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async createQuiz(
    @Body() body: {title: string; description: string},
  ): Promise<Quiz> {
    return this.quizService.createQuiz(body.title, body.description);
  }

  @Get()
  async getAllQuizzes(): Promise<Quiz[]> {
    return this.quizService.getAllQuizzes();
  }

  @Get(':id')
  async getQuizById(@Param('id') id: number): Promise<Quiz | null> {
    return this.quizService.getQuizById(id);
  }

  @Put(':id')
  async updateQuiz(
    @Param('id') id: number,
    @Body() body: {title: string; description: string},
  ): Promise<Quiz> {
    return this.quizService.updateQuiz(id, body.title, body.description);
  }

  @Delete(':id')
  async deleteQuiz(@Param('id') id: number): Promise<Quiz> {
    return this.quizService.deleteQuiz(id);
  }
}

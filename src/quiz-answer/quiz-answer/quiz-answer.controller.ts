import {Controller, Post, Get, Put, Delete, Param, Body} from '@nestjs/common';
import {QuizAnswerService} from './quiz-answer.service';
import {QuizAnswer} from '@prisma/client';
import {CreateQuizAnswerDto, UpdateQuizAnswerDto} from './quiz-answer.dto';

@Controller('api/auth/quiz-answers')
export class QuizAnswerController {
  constructor(private readonly quizAnswerService: QuizAnswerService) {}

  @Post()
  async createQuizAnswer(
    @Body() data: CreateQuizAnswerDto,
  ): Promise<QuizAnswer> {
    return this.quizAnswerService.createQuizAnswer(data);
  }

  @Get()
  async getAllQuizAnswers(): Promise<QuizAnswer[]> {
    return this.quizAnswerService.getAllQuizAnswers();
  }

  @Get(':id')
  async getQuizAnswerById(@Param('id') id: number): Promise<QuizAnswer | null> {
    return this.quizAnswerService.getQuizAnswerById(id);
  }

  @Put(':id')
  async updateQuizAnswer(
    @Param('id') id: number,
    @Body() data: UpdateQuizAnswerDto,
  ): Promise<QuizAnswer> {
    return this.quizAnswerService.updateQuizAnswer(id, data);
  }

  @Delete(':id')
  async deleteQuizAnswer(@Param('id') id: number): Promise<QuizAnswer> {
    return this.quizAnswerService.deleteQuizAnswer(id);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { QuestionQuizController } from './question-quiz.controller';

describe('QuestionQuizController', () => {
  let controller: QuestionQuizController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionQuizController],
    }).compile();

    controller = module.get<QuestionQuizController>(QuestionQuizController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

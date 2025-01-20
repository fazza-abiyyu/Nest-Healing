import { Test, TestingModule } from '@nestjs/testing';
import { QuestionQuizService } from './question-quiz.service';

describe('QuestionQuizService', () => {
  let service: QuestionQuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionQuizService],
    }).compile();

    service = module.get<QuestionQuizService>(QuestionQuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

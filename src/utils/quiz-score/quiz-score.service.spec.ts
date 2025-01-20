import { Test, TestingModule } from '@nestjs/testing';
import { QuizScoreService } from './quiz-score.service';

describe('QuizScoreService', () => {
  let service: QuizScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizScoreService],
    }).compile();

    service = module.get<QuizScoreService>(QuizScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {PrismaModule} from './prisma/prisma.module';
import {JwtService} from './utils/jwt/jwt.service';
import {JwtModule} from './utils/jwt/jwt.module';
import {AuthMiddleware} from './auth/auth/auth.middleware';
import {ConfigModule} from '@nestjs/config';
import {PrismaService} from './prisma/prisma.service';
import {RefreshTokenModule} from './refresh-token/refresh-token.module';
import {RefreshTokenService} from './refresh-token/refresh-token.service';
import {RbaMiddleware} from './user/user/user.middleware';
import {QuizScoreModule} from './utils/quiz-score/quiz-score.module';
import {QuestionQuizModule} from './question-quiz/question-quiz.module';
import {QuizModule} from './quiz/quiz.module';
import {QuizAnswerModule} from './quiz-answer/quiz-answer.module';
import {QuizResultModule} from './quiz-result/quiz-result.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    JwtModule,
    RefreshTokenModule,
    QuizScoreModule,
    QuestionQuizModule,
    QuizModule,
    QuizAnswerModule,
    QuizResultModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService, PrismaService, RefreshTokenService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware, RbaMiddleware).forRoutes(
      {path: '/api/auth/user', method: RequestMethod.ALL},
      {path: '/api/auth/logs', method: RequestMethod.ALL},
      {path: '/api/auth/logout', method: RequestMethod.ALL},
      {path: '/api/auth/profile', method: RequestMethod.ALL},
      {path: '/api/auth/quiz', method: RequestMethod.ALL},
      {path: '/api/auth/quiz/:id', method: RequestMethod.ALL},
      {
        path: '/api/auth/quiz?page=:page&pagesize=:pagesize',
        method: RequestMethod.ALL,
      },
      {path: '/api/auth/quiz-questions', method: RequestMethod.ALL},
      {path: '/api/auth/quiz-questions/:id', method: RequestMethod.ALL},
      {
        path: '/api/auth/quiz-questions?page=:page&pagesize=:pagesize',
        method: RequestMethod.ALL,
      },
      {path: '/api/auth/user-quiz-results', method: RequestMethod.ALL},
      {path: '/api/auth/user-quiz-results/:id', method: RequestMethod.ALL},
      {
        path: '/api/auth/user-quiz-results?page=:page&pageSize=:pagesize',
        method: RequestMethod.ALL,
      },
      {path: '/api/auth/stats', method: RequestMethod.ALL},
      {path: '/api/auth/graph?year=:year', method: RequestMethod.ALL},
    );
  }
}

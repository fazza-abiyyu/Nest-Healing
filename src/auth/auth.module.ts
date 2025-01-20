import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {JwtService} from '../utils/jwt/jwt.service';
import {AuthController} from './auth/auth.controller';
import {AuthService} from './auth/auth.service';
import {UserService} from '../user/user/user.service';
import {PrismaService} from '../prisma/prisma.service';
import {RefreshTokenService} from '../refresh-token/refresh-token.service';
import {RefreshTokenModule} from '../refresh-token/refresh-token.module';

@Module({
  imports: [ConfigModule, RefreshTokenModule],
  providers: [
    JwtService,
    AuthService,
    UserService,
    JwtService,
    PrismaService,
    RefreshTokenService,
  ],
  exports: [JwtService],
  controllers: [AuthController],
})
export class AuthModule {}

import {Module} from '@nestjs/common';
import {RefreshTokenService} from './refresh-token.service';
import {PrismaService} from '../prisma/prisma.service';
import {RefreshTokenController} from './refresh-token.controller';

@Module({
  providers: [RefreshTokenService, PrismaService],
  exports: [RefreshTokenService],
  controllers: [RefreshTokenController],
})
export class RefreshTokenModule {}

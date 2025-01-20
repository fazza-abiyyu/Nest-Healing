import {Module} from '@nestjs/common';
import {JwtService} from './jwt.service';
import {ConfigModule} from '@nestjs/config';
import {PrismaModule} from '../../prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}

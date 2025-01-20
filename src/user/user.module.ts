import {Module} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {JwtModule} from '../utils/jwt/jwt.module';
import {UserService} from './user/user.service';
import {UserController} from './user/user.controller';

@Module({
  imports: [JwtModule], // Tambahkan JwtModule di sini
  providers: [UserService, PrismaService],
  controllers: [UserController],
})
export class UserModule {}

import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, refreshToken: string) {
    console.log('Creating refresh token in database:', refreshToken); // Debug log
    const createdToken = await this.prisma.refreshToken.create({
      data: {
        user_id: userId,
        refresh_token: refreshToken,
      },
    });
    console.log('Refresh token created:', createdToken); // Debug log
    return createdToken;
  }

  async findToken(token: string) {
    console.log('Finding refresh token in database:', token); // Debug log
    const foundToken = await this.prisma.refreshToken.findFirst({
      where: {refresh_token: token.trim()}, // Trim any extra spaces
    });
    console.log('Found refresh token:', foundToken); // Debug log
    return foundToken;
  }

  async deleteToken(token: string) {
    console.log('Deleting refresh token in database:', token); // Debug log
    const deleteResult = await this.prisma.refreshToken.deleteMany({
      where: {refresh_token: token.trim()}, // Trim any extra spaces
    });
    console.log('Refresh token deletion result:', deleteResult); // Debug log
    return deleteResult;
  }

  async deleteTokenByUserId(userId: string) {
    console.log('Deleting refresh tokens for user ID:', userId); // Debug log
    const deleteResult = await this.prisma.refreshToken.deleteMany({
      where: {user_id: Number(userId)}, // Convert to number
    });
    console.log('Refresh token deletion result by user ID:', deleteResult); // Debug log
    return deleteResult;
  }
}

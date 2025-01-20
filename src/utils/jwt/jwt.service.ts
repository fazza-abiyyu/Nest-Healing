import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import {User} from '@prisma/client';
import {Response} from 'express';
import {PrismaService} from '../../prisma/prisma.service';

@Injectable()
export class JwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  generateToken(payload: {id: string}): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessTokenSecret = this.configService.get<string>(
      'JWT_ACCESS_TOKEN_SECRET',
    );
    const refreshTokenSecret = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_SECRET',
    );

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: '7d',
    });

    return {accessToken, refreshToken};
  }

  generateAccessToken(payload: {id: string}): string {
    const accessTokenSecret = this.configService.get<string>(
      'JWT_ACCESS_TOKEN_SECRET',
    );
    return jwt.sign(payload, accessTokenSecret, {expiresIn: '15m'});
  }

  decodeAccessToken(token: string): any {
    const accessTokenSecret = this.configService.get<string>(
      'JWT_ACCESS_TOKEN_SECRET',
    );
    try {
      return jwt.verify(token, accessTokenSecret);
    } catch (err) {
      console.error('Error decoding access token:', err);
      return null;
    }
  }

  decodeRefreshToken(token: string): any {
    const refreshTokenSecret = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_SECRET',
    );
    try {
      return jwt.verify(token, refreshTokenSecret);
    } catch (err) {
      console.error('Error decoding refresh token:', err);
      return null;
    }
  }

  async getUserByToken(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({where: {id: Number(id)}});
  }

  sendRefreshToken(res: Response, token: string) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/api/auth',
    });
  }

  deleteRefreshToken(res: Response) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/api/auth',
    });
  }

  deleteAccessToken(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
  }
}

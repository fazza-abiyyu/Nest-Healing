import {Injectable, NestMiddleware} from '@nestjs/common';
import {JwtService} from '../../utils/jwt/jwt.service';
import {RefreshTokenService} from '../../refresh-token/refresh-token.service';
import {User} from '@prisma/client';
import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Headers:', req.headers); // Log headers for debugging
    const authorizationHeader = req.headers['authorization'];
    const refreshToken = req.cookies['refresh_token'];
    console.log('Authorization Header:', authorizationHeader); // Log authorization header for debugging

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({message: 'Unauthorized: Token is missing'});
    }

    const accessToken = authorizationHeader.split(' ')[1];
    console.log('Access Token:', accessToken); // Log access token for debugging

    try {
      const decodedToken = this.jwtService.decodeAccessToken(accessToken);
      console.log('Decoded Token:', decodedToken); // Log decoded token for debugging

      const user: User | null = await this.jwtService.getUserByToken(
        decodedToken.id,
      );
      if (!user) {
        return res.status(401).json({message: 'Unauthorized: User not found'});
      }

      req['user'] = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.log('Access token expired'); // Debug log
        if (refreshToken) {
          const validRefreshToken =
            await this.refreshTokenService.findToken(refreshToken);
          if (!validRefreshToken) {
            return res
              .status(401)
              .json({message: 'Unauthorized: Invalid refresh token'});
          }
          // Generate new access token using refresh token
          const newTokens = this.jwtService.generateToken({
            id: validRefreshToken.user_id.toString(),
          });
          res.cookie('access_token', newTokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
          });

          // Set new access token in authorization header
          req.headers['authorization'] = `Bearer ${newTokens.accessToken}`;

          req['user'] = await this.jwtService.getUserByToken(
            validRefreshToken.user_id.toString(),
          );
          next();
        } else {
          return res
            .status(401)
            .json({message: 'Unauthorized: Refresh token is missing'});
        }
      } else {
        return res
          .status(401)
          .json({message: 'Unauthorized: Invalid access token'});
      }
    }
  }
}

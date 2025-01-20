import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtService} from '../../utils/jwt/jwt.service';
import {Request, Response} from 'express';
import {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
} from '../dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginRequestDto, @Res() res: Response) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    const tokens = await this.authService.login(user); // Use AuthService to handle login logic
    this.jwtService.sendRefreshToken(res, tokens.refreshToken);

    // Kirim access token ke cookies
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    const response: LoginResponseDto = {
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      accessToken: tokens.accessToken,
    };

    return res.json(response);
  }

  @Post('register')
  async register(@Body() body: RegisterRequestDto, @Res() res: Response) {
    await this.authService.registerUser(
      body.username,
      body.password,
      body.email,
      body.full_name,
    );
    return res.json({message: 'Pendaftaran akun berhasil'});
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    const decoded = this.jwtService.decodeRefreshToken(refreshToken);
    if (!decoded) {
      throw new UnauthorizedException('Refresh token tidak valid');
    }

    const tokens = this.jwtService.generateToken({id: decoded.id});
    this.jwtService.sendRefreshToken(res, tokens.refreshToken);

    return res.json({accessToken: tokens.accessToken});
  }

  @Get('logs')
  async getLogs(@Req() req: Request) {
    const user = req['user'];
    const logs = await this.authService.getUserLogs(user.id);
    return logs;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies['access_token'];
    console.log('Access Token:', accessToken); // Debug log
    if (!accessToken) {
      return res.status(401).json({message: 'Access token tidak ada'});
    }

    const decodedToken = this.jwtService.decodeAccessToken(accessToken);
    if (!decodedToken) {
      return res.status(401).json({message: 'Access token tidak valid'});
    }

    console.log('Decoded Token:', decodedToken); // Debug log

    // Hapus refresh token dari database menggunakan user ID melalui AuthService
    const deleteResult = await this.authService.logoutByUserId(decodedToken.id);
    console.log('Refresh token deletion result:', deleteResult); // Debug log

    // Clear the refresh and access tokens from the cookies
    this.jwtService.deleteRefreshToken(res);
    this.jwtService.deleteAccessToken(res);

    // Optionally, send a response to confirm logout
    res.status(200).send({message: 'Logout berhasil'});
  }
}

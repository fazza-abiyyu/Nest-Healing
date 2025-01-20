import {Injectable} from '@nestjs/common';
import {JwtService} from '../../utils/jwt/jwt.service';
import {RefreshTokenService} from '../../refresh-token/refresh-token.service';
import {Role, User} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {UserService} from '../../user/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    console.log(`Validating user with email: ${email}`); // Debug log
    const user = await this.userService.findByEmail(email);
    if (user) {
      console.log(`User found: ${user.email}`); // Debug log
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        console.log('Password matches'); // Debug log
        return user;
      } else {
        console.log('Password does not match'); // Debug log
      }
    } else {
      console.log('User not found'); // Debug log
    }
    return null;
  }

  async registerUser(
    username: string,
    password: string,
    email: string,
    fullName: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.create({
      username,
      password: hashedPassword,
      email,
      full_name: fullName,
      role: Role.USER,
    });
  }

  async login(user: User) {
    const tokens = this.jwtService.generateToken({id: user.id.toString()});
    await this.refreshTokenService.create(user.id, tokens.refreshToken); // Save refresh token to database
    console.log('Refresh token saved to database:', tokens.refreshToken); // Debug log
    return tokens;
  }

  async logout(refreshToken: string) {
    console.log('Checking refresh token in database:', refreshToken); // Debug log
    const validRefreshToken =
      await this.refreshTokenService.findToken(refreshToken);
    console.log('Valid refresh token found in database:', validRefreshToken); // Debug log
    if (!validRefreshToken) {
      return false;
    }
    const deleteResult =
      await this.refreshTokenService.deleteToken(refreshToken); // Delete refresh token from database
    console.log('Refresh token deleted from database:', deleteResult); // Debug log
    return true;
  }

  async logoutByUserId(userId: string) {
    console.log('Deleting refresh tokens for user ID:', userId); // Debug log
    const deleteResult =
      await this.refreshTokenService.deleteTokenByUserId(userId);
    console.log('Refresh token deletion result by user ID:', deleteResult); // Debug log
    return deleteResult;
  }

  async getUserLogs(userId: number) {
    return this.userService.getLogs(userId);
  }
}

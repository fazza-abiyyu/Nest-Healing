import {Role} from '@prisma/client';

export class RegisterRequestDto {
  username: string;
  password: string;
  email: string;
  full_name: string;
  role: Role;
  otp?: number;
  created_at?: Date;
  updated_at?: Date;
}

export class LoginRequestDto {
  email: string;
  password: string;
}

export class LoginResponseDto {
  username: string;
  email: string;
  full_name: string;
  role: Role;
  accessToken: string;
}

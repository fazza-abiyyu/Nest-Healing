import {Role} from '@prisma/client';

export class CreateUserDto {
  username: string;
  password: string;
  email: string;
  full_name: string;
  role: Role;
}

export class UpdateUserDto {
  username?: string;
  password?: string;
  email?: string;
  full_name?: string;
  role?: Role;
}

export class UserResponseDto {
  id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
  created_at: Date;
  updated_at: Date;
}

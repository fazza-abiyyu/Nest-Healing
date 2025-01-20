import {Injectable, NotFoundException} from '@nestjs/common';
import {User} from '@prisma/client';
import {CreateUserDto, UpdateUserDto} from '../dto/user.dto';
import {PrismaService} from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Create user
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  // Find user by ID
  async findById(id: number): Promise<User | null> {
    const userId = parseInt(id.toString(), 10);
    const user = await this.prisma.user.findUnique({
      where: {id: userId},
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Find user by username
  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {username},
    });
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new Error('Email must be provided');
    }
    return this.prisma.user.findUnique({where: {email}});
  }

  // Find all users
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // Update user by ID
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const userId = parseInt(id.toString(), 10);
    return this.prisma.user.update({
      where: {id: userId},
      data: updateUserDto,
    });
  }

  // Delete user by ID
  async remove(id: number): Promise<User> {
    const userId = parseInt(id.toString(), 10);
    const user = await this.prisma.user.findUnique({
      where: {id: userId},
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.delete({
      where: {id: userId},
    });
  }

  // Get user logs
  async getLogs(userId: number): Promise<any> {
    return this.prisma.log.findMany({
      where: {user_id: userId},
    });
  }
}

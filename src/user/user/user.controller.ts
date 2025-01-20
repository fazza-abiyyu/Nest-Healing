import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Put,
  Req,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import {CreateUserDto, UpdateUserDto, UserResponseDto} from '../dto/user.dto';
import {Request, Response} from 'express';
import {JwtService} from '../../utils/jwt/jwt.service';
import {Roles} from './user.decorator';
import {AuthGuard} from '../../auth/auth/auth.guard';
import {RolesGuard} from './user.guard';

@Controller('api/auth/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Middleware untuk memeriksa token
  private async checkAccessToken(
    req: Request,
    res: Response,
  ): Promise<boolean> {
    const accessToken = req.cookies['access_token'];
    if (!accessToken) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({message: 'Unauthorized: Token is missing'});
      return false;
    }

    const decodedToken = this.jwtService.decodeAccessToken(accessToken);
    if (!decodedToken) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({message: 'Invalid access token'});
      return false;
    }

    req['user'] = decodedToken;
    return true;
  }

  // Create user
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    if (!(await this.checkAccessToken(req, res))) return;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    const user = await this.userService.create(createUserDto);
    return res.json(this.transformUserToResponse(user));
  }

  // Update user by ID
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    if (!(await this.checkAccessToken(req, res))) return;
    try {
      if (updateUserDto.password) {
        const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
        updateUserDto.password = hashedPassword;
      }
      const user = await this.userService.update(id, updateUserDto);
      return res.json(this.transformUserToResponse(user));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({message: 'Internal server error'});
    }
  }

  // Get all users
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async findAll(@Req() req: Request, @Res() res: Response): Promise<any> {
    if (!(await this.checkAccessToken(req, res))) return;

    const users = await this.userService.findAll();
    return res.json(users.map(this.transformUserToResponse));
  }

  // Get user by ID
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    if (!(await this.checkAccessToken(req, res))) return;

    try {
      const user = await this.userService.findById(id);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({message: `User with ID ${id} not found`});
      }
      return res.json(this.transformUserToResponse(user));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({message: 'Internal server error'});
    }
  }

  // Delete user by ID
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    if (!(await this.checkAccessToken(req, res))) return;

    try {
      const user = await this.userService.remove(id);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({message: `User with ID ${id} not found`});
      }
      return res.json({message: 'Successfully deleted user'});
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({message: 'Internal server error'});
    }
  }

  private transformUserToResponse(user: User): UserResponseDto {
    const {id, username, full_name, email, role, created_at, updated_at} = user;
    return {id, username, full_name, email, role, created_at, updated_at};
  }
}

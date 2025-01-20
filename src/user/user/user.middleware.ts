import {Injectable, NestMiddleware} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {User} from '@prisma/client';

@Injectable()
export class RbaMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const user: User | undefined = req['user'];

    if (!user) {
      return res.status(401).json({message: 'Unauthorized: User not found'});
    }

    const allowedRoles = ['ADMIN', 'USER']; // Define allowed roles

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        message:
          'Forbidden: You do not have the required role to access this resource',
      });
    }

    next();
  }
}

import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

export interface AppRequest extends Request {
  user?: User
}

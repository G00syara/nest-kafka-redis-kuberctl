import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('createUser')
  async createUser(userData: { name: string; email: string }): Promise<User> {
    return this.userService.createUser(userData);
  }

  @MessagePattern('getUser')
  async getUser(id: string): Promise<User> {
    return this.userService.getUser(id);
  }
}
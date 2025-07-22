import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RedisService } from '@nestjs-modules/ioredis';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private redisService: RedisService,
  ) {}

  async createUser(userData: { name: string; email: string }): Promise<User> {
    const user = this.userRepository.create(userData);
    await this.userRepository.save(user);
    await this.redisService.getClient().set(`user:${user.id}`, JSON.stringify(user));
    return user;
  }

  async getUser(id: string): Promise<User> {
    const cachedUser = await this.redisService.getClient().get(`user:${id}`);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      await this.redisService.getClient().set(`user:${id}`, JSON.stringify(user));
    }
    return user;
  }
}
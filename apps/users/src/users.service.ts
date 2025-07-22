import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users: any[] = [
    { id: 1, firstName: 'Alex', lastName: 'Doe', age: 25 },
    { id: 2, firstName: 'Koal', lastName: 'Non', age: 22 },
  ];

  findAll() {
    return this.users;
  }
}

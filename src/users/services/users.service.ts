import { Injectable } from '@nestjs/common';

import { User } from '../models';

import { PrismaService } from '../../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne({ name, password }: User): Promise<User> {
    return await this.prisma.user.findFirst({
      where: { name, password },
    });
  }

  async createOne({ name, password }: User): Promise<User> {
    return await this.prisma.user.create({
      data: {
        name,
        password,
      },
    });
  }

}

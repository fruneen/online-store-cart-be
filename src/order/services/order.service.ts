import { Injectable } from '@nestjs/common';

import { Order } from '../models';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Order> {
    return await this.prisma.order.findUnique({
      where: { id },
    });
  }

  async create({ userId, cartId, items, payment, delivery, comments, total }, prismaService?): Promise<Order> {
    const prisma = prismaService || this.prisma;

    return await prisma.order.create({
      data: {
        userId,
        cartId,
        total,
        items,
        payment,
        delivery,
        comments,
      }
    });
  }

  async update(orderId, data): Promise<Order> {
    return await this.prisma.order.update({
      where: { id: orderId },
      data,
    });
  }
}

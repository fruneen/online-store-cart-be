import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma.service';
import { Cart } from '../models';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Cart> {
    const { id: cartId } = await this.prisma.cart.findUnique({
      where: { userId },
    });

    const items = await this.prisma.cartItem.findMany({
      where: { cartId },
      include: {
        product: true,
      }
    });

    return {
      id: cartId,
      items,
    }
  }

  async createByUserId(userId: string) {
    const { id: cartId } = await this.prisma.cart.create({
      data: {
        userId,
      }
    });

    return {
      id: cartId,
      items: [],
    }
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = await this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return await this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id: cartId } = await this.findOrCreateByUserId(userId);

    await Promise.all(items.map(async (item) => {
      const { id: productId } = item.product;

      await this.prisma.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId,
            productId,
          }
        },
        create: {
          cartId,
          productId,
          count: item.count,
        },
        update: {
          count: item.count,
        }
      });
    }))

    const createdItems = await this.prisma.cartItem.findMany({
      where: { cartId },
      include: {
        product: true,
      }
    });

    return {
      id: cartId,
      items: createdItems,
    }
  }

  async removeByUserId(userId, prismaService?): Promise<void> {
    const prisma = prismaService || this.prisma;

    const { id: cartId } = await this.findOrCreateByUserId(userId);

    await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCart(userId: string) {
    return this.prisma.cartItem.findMany({
      where: { userId },
      include: { sticker: true },
    });
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const { stickerId, quantity } = dto;

    // Check if sticker exists
    const sticker = await this.prisma.sticker.findUnique({ where: { id: stickerId } });
    if (!sticker) throw new NotFoundException('Sticker not found');

    // Check if item already in cart
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { userId, stickerId },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { sticker: true },
      });
    }

    return this.prisma.cartItem.create({
      data: { userId, stickerId, quantity },
      include: { sticker: true },
    });
  }

  async updateQuantity(id: string, userId: string, dto: UpdateCartItemDto) {
    const item = await this.prisma.cartItem.findFirst({ where: { id, userId } });
    if (!item) throw new NotFoundException('Cart item not found');

    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity: dto.quantity },
      include: { sticker: true },
    });
  }

  async removeItem(id: string, userId: string) {
    const item = await this.prisma.cartItem.findFirst({ where: { id, userId } });
    if (!item) throw new NotFoundException('Cart item not found');

    await this.prisma.cartItem.delete({ where: { id } });
    return { success: true };
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OrdersService {
  private transporter;

  constructor(private prisma: PrismaService) {
    // Basic SMTP config for testing (e.g. Ethereal)
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal_user', // Replace with real config
        pass: 'ethereal_pass',
      },
    });
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { sticker: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.sticker.price * item.quantity,
      0,
    );
    
    // Apply dummy promo logic
    const total = dto.promoCode === 'SAVE10' ? subtotal * 0.9 : subtotal;

    // Use transaction for safety
    const order = await this.prisma.$transaction(async (tx) => {
      // 1. Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: 'PENDING',
          items: {
            create: cartItems.map((item) => ({
              stickerId: item.stickerId,
              quantity: item.quantity,
              price: item.sticker.price,
            })),
          },
        },
        include: { items: { include: { sticker: true } } },
      });

      // 2. Clear the cart
      await tx.cartItem.deleteMany({ where: { userId } });

      return newOrder;
    });

    // 3. Send email asynchronously
    this.sendConfirmationEmail(userId, order);

    return order;
  }

  async getOrderHistory(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { sticker: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllOrders() {
    return this.prisma.order.findMany({
      include: { 
        items: { include: { sticker: true } },
        user: { select: { email: true } }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  private async sendConfirmationEmail(userId: string, order: any) {
    try {
      // In a real app, fetch user email. Using placeholder for now.
      const info = await this.transporter.sendMail({
        from: '"DevStickers" <noreply@devstickers.io>',
        to: 'customer@example.com',
        subject: `Order Confirmation #${order.id.split('-')[0]}`,
        text: `Your order for ${order.total}$ has been placed successfully!`,
        html: `<b>Total: ${order.total}$</b><p>Status: ${order.status}</p>`,
      });
      console.log('Message sent: %s', info.messageId);
    } catch (e) {
      console.error('Failed to send email:', e);
    }
  }
}

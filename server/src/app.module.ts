import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { StickersModule } from './modules/stickers/stickers.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, StickersModule, CartModule, OrdersModule],
})
export class AppModule {}

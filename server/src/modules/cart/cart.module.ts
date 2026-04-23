import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'super-secret-key', // Use env in production
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}

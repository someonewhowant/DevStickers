import { Controller, Get, Post, Patch, Delete, Body, Param, Headers, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly jwtService: JwtService
  ) {}

  // Simplified identification logic for this stage
  private getUserId(headers: any): string {
    const authHeader = headers['authorization'];
    if (authHeader) {
      // For real Auth module, we would verify properly. 
      // For now, let's assume it's a UUID or 'guest'
      return authHeader.replace('Bearer ', '');
    }
    
    const guestToken = headers['x-guest-token'];
    if (guestToken) {
      try {
        const decoded = this.jwtService.verify(guestToken);
        return decoded.guestId;
      } catch (e) {
        throw new BadRequestException('Invalid guest token');
      }
    }
    
    throw new BadRequestException('User identification required (Auth or Guest Token)');
  }

  @Get()
  findAll(@Headers() headers: any) {
    const userId = this.getUserId(headers);
    return this.cartService.getCart(userId);
  }

  @Post('add')
  add(@Headers() headers: any, @Body() dto: AddToCartDto) {
    const userId = this.getUserId(headers);
    return this.cartService.addToCart(userId, dto);
  }

  @Patch('update/:id')
  update(@Headers() headers: any, @Param('id') id: string, @Body() dto: UpdateCartItemDto) {
    const userId = this.getUserId(headers);
    return this.cartService.updateQuantity(id, userId, dto);
  }

  @Delete('remove/:id')
  remove(@Headers() headers: any, @Param('id') id: string) {
    const userId = this.getUserId(headers);
    return this.cartService.removeItem(id, userId);
  }
  
  @Post('guest-token')
  createGuestToken() {
    const guestId = 'guest-' + Math.random().toString(36).substr(2, 9);
    const token = this.jwtService.sign({ guestId });
    return { token };
  }
}

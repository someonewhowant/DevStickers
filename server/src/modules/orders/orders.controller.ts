import { Controller, Get, Post, Body, Headers, BadRequestException, Param, Patch, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtService } from '@nestjs/jwt';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly jwtService: JwtService
  ) {}

  private getUserId(headers: any): string {
    const authHeader = headers['authorization'];
    if (authHeader) return authHeader.replace('Bearer ', '');
    
    const guestToken = headers['x-guest-token'];
    if (guestToken) {
      try {
        const decoded = this.jwtService.verify(guestToken);
        return decoded.guestId;
      } catch (e) {
        throw new BadRequestException('Invalid guest token');
      }
    }
    throw new BadRequestException('User identification required');
  }

  @Post('create')
  create(@Headers() headers: any, @Body() dto: CreateOrderDto) {
    const userId = this.getUserId(headers);
    return this.ordersService.createOrder(userId, dto);
  }

  @Get()
  findAll(@Headers() headers: any) {
    const userId = this.getUserId(headers);
    return this.ordersService.getOrderHistory(userId);
  }

  // ADMIN Endpoints
  @Get('admin/all')
  @UseGuards(AdminGuard)
  adminFindAll() {
    return this.ordersService.getAllOrders();
  }

  @Patch(':id/status')
  @UseGuards(AdminGuard)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateOrderStatus(id, status);
  }
}

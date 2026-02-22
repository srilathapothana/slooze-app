import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { OrderType, OrderItemInput } from './order.type';
import { GqlAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { PrismaService } from '../prisma/prisma.service';

const orderInclude = {
  user: true,
  items: { include: { menuItem: true } },
};

@Resolver(() => OrderType)
export class OrdersResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [OrderType])
  @UseGuards(GqlAuthGuard)
  async myOrders(@CurrentUser() user: any) {
    return this.prisma.order.findMany({
      where: { userId: user.id },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Query(() => [OrderType])
  @UseGuards(GqlAuthGuard)
  async allOrders(@CurrentUser() user: any) {
    if (!['ADMIN', 'MANAGER'].includes(user.role)) {
      throw new ForbiddenException('Only Admins and Managers can view all orders');
    }
    return this.prisma.order.findMany({
      where: { country: user.country },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Mutation(() => OrderType)
  @UseGuards(GqlAuthGuard)
  async createOrder(
    @Args('restaurantId') restaurantId: string,
    @Args('items', { type: () => [OrderItemInput] }) items: OrderItemInput[],
    @CurrentUser() user: any,
  ) {
    // Verify restaurant is in user's country
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant || restaurant.country !== user.country) {
      throw new ForbiddenException('Restaurant not accessible in your country');
    }

    // Calculate total
    let total = 0;
    const orderItems = [];
    for (const item of items) {
      const menuItem = await this.prisma.menuItem.findUnique({ where: { id: item.menuItemId } });
      if (!menuItem) throw new Error(`Menu item ${item.menuItemId} not found`);
      const price = menuItem.price * item.quantity;
      total += price;
      orderItems.push({ menuItemId: item.menuItemId, quantity: item.quantity, price });
    }

    return this.prisma.order.create({
      data: {
        userId: user.id,
        restaurantId,
        country: user.country,
        totalAmount: total,
        items: { create: orderItems },
      },
      include: orderInclude,
    });
  }

  @Mutation(() => OrderType)
  @UseGuards(GqlAuthGuard)
  async checkout(
    @Args('orderId') orderId: string,
    @Args('paymentMethodId') paymentMethodId: string,
    @CurrentUser() user: any,
  ) {
    // Only ADMIN and MANAGER can checkout
    if (!['ADMIN', 'MANAGER'].includes(user.role)) {
      throw new ForbiddenException('Members cannot checkout. Please ask a Manager or Admin.');
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');
    if (order.country !== user.country) throw new ForbiddenException('Access denied');

    // Verify payment method belongs to user (if admin) or to the order user
    const pm = await this.prisma.paymentMethod.findUnique({ where: { id: paymentMethodId } });
    if (!pm) throw new Error('Payment method not found');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED', paymentMethodId },
      include: orderInclude,
    });
  }

  @Mutation(() => OrderType)
  @UseGuards(GqlAuthGuard)
  async cancelOrder(
    @Args('orderId') orderId: string,
    @CurrentUser() user: any,
  ) {
    if (!['ADMIN', 'MANAGER'].includes(user.role)) {
      throw new ForbiddenException('Members cannot cancel orders');
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error('Order not found');
    if (order.country !== user.country) throw new ForbiddenException('Access denied');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: orderInclude,
    });
  }
}

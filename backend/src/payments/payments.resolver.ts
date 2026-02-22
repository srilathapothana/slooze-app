import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { PaymentMethodType } from './payment.type';
import { GqlAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { PrismaService } from '../prisma/prisma.service';

@Resolver(() => PaymentMethodType)
export class PaymentsResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [PaymentMethodType])
  @UseGuards(GqlAuthGuard)
  async myPaymentMethods(@CurrentUser() user: any) {
    return this.prisma.paymentMethod.findMany({ where: { userId: user.id } });
  }

  @Mutation(() => PaymentMethodType)
  @UseGuards(GqlAuthGuard)
  async addPaymentMethod(
    @Args('type') type: string,
    @Args('last4', { nullable: true }) last4?: string,
    @Args('cardBrand', { nullable: true }) cardBrand?: string,
    @Args('upiId', { nullable: true }) upiId?: string,
    @CurrentUser() user?: any,
  ) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only Admins can add payment methods');
    }
    return this.prisma.paymentMethod.create({
      data: { userId: user.id, type, last4, cardBrand, upiId },
    });
  }

  @Mutation(() => PaymentMethodType)
  @UseGuards(GqlAuthGuard)
  async setDefaultPaymentMethod(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only Admins can modify payment methods');
    }
    await this.prisma.paymentMethod.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });
    return this.prisma.paymentMethod.update({
      where: { id },
      data: { isDefault: true },
    });
  }

  @Mutation(() => PaymentMethodType)
  @UseGuards(GqlAuthGuard)
  async deletePaymentMethod(
    @Args('id') id: string,
    @CurrentUser() user: any,
  ) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Only Admins can delete payment methods');
    }
    return this.prisma.paymentMethod.delete({ where: { id } });
  }
}

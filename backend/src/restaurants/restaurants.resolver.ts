import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantType } from './restaurant.type';
import { GqlAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { PrismaService } from '../prisma/prisma.service';

@Resolver(() => RestaurantType)
export class RestaurantsResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [RestaurantType])
  @UseGuards(GqlAuthGuard)
  async restaurants(@CurrentUser() user: any) {
    // Re-BAC: users can only see restaurants in their country
    return this.prisma.restaurant.findMany({
      where: { country: user.country },
      include: { menuItems: true },
    });
  }

  @Query(() => RestaurantType, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async restaurant(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: any,
  ) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: true },
    });
    if (restaurant && restaurant.country !== user.country) {
      throw new Error('Access denied: restaurant not in your country');
    }
    return restaurant;
  }
}

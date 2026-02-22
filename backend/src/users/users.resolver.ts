import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserType } from './user.type';
import { GqlAuthGuard } from '../auth/guards';
import { CurrentUser } from '../auth/decorators';
import { PrismaService } from '../prisma/prisma.service';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: any) {
    return this.prisma.user.findUnique({ where: { id: user.id } });
  }

  @Query(() => [UserType])
  @UseGuards(GqlAuthGuard)
  async users(@CurrentUser() user: any) {
    // Only admins can see all users
    if (user.role !== 'ADMIN') {
      throw new Error('Forbidden');
    }
    return this.prisma.user.findMany({ where: { country: user.country } });
  }
}

import { Module } from '@nestjs/common';
import { OrdersResolver } from './orders.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [OrdersResolver],
})
export class OrdersModule {}

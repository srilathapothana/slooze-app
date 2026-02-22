import { Module } from '@nestjs/common';
import { RestaurantsResolver } from './restaurants.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RestaurantsResolver],
})
export class RestaurantsModule {}

import { Module } from '@nestjs/common';
import { PaymentsResolver } from './payments.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PaymentsResolver],
})
export class PaymentsModule {}

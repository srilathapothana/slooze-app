import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PaymentMethodType {
  @Field(() => ID)
  id: string;

  @Field()
  type: string;

  @Field({ nullable: true })
  last4?: string;

  @Field({ nullable: true })
  cardBrand?: string;

  @Field({ nullable: true })
  upiId?: string;

  @Field()
  isDefault: boolean;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;
}

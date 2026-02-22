import { ObjectType, Field, ID, Float, InputType, Int } from '@nestjs/graphql';
import { MenuItemType } from '../restaurants/restaurant.type';
import { UserType } from '../users/user.type';

@ObjectType()
export class OrderItemType {
  @Field(() => ID)
  id: string;

  @Field(() => MenuItemType)
  menuItem: MenuItemType;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

@ObjectType()
export class OrderType {
  @Field(() => ID)
  id: string;

  @Field(() => UserType)
  user: UserType;

  @Field()
  restaurantId: string;

  @Field(() => [OrderItemType])
  items: OrderItemType[];

  @Field()
  status: string;

  @Field(() => Float)
  totalAmount: number;

  @Field()
  country: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class OrderItemInput {
  @Field()
  menuItemId: string;

  @Field(() => Int)
  quantity: number;
}

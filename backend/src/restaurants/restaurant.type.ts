import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class MenuItemType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field()
  category: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  restaurantId: string;
}

@ObjectType()
export class RestaurantType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  cuisine: string;

  @Field()
  country: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => Float)
  rating: number;

  @Field(() => [MenuItemType])
  menuItems: MenuItemType[];

  @Field()
  createdAt: Date;
}

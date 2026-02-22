import { Resolver, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserType } from '../users/user.type';

@ObjectType()
class AuthPayload {
  @Field()
  token: string;

  @Field(() => UserType)
  user: UserType;
}

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.login(email, password);
  }

  @Mutation(() => AuthPayload)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args('role', { defaultValue: 'MEMBER' }) role: string,
    @Args('country', { defaultValue: 'INDIA' }) country: string,
  ) {
    return this.authService.register(email, password, name, role as any, country as any);
  }
}

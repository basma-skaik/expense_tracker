import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      // 1. Extract JWT token from Authorization Header as Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Strictly reject token if it is expired
      secretOrKey: process.env.JWT_SECRET || 'mysecret',
    });
  }

  // 2. This method runs automatically after passport successfully validates the token signature
  async validate(payload: { sub: number; email: string }) {
    // payload contains decoded fields (sub is user id)
    const user = await this.usersService.findOneByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    // Whatever is returned here is automatically attached to the Express Request object as request.user
    return { id: user.id, email: user.email };
  }
}

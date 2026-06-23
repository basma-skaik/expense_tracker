import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      // قراءة التوكن من الـ Body الخاص بالريكويست
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_REFRESH_SECRET || 'my_super_secret_refresh_key',
      passReqToCallback: true, // نمرر الـ Request بالكامل لكي نأخذ التوكن الخام ونقارنه بالداتابيز
    });
  }

  async validate(req: Request, payload: { sub: number; email: string }) {
    const refreshToken = req.body.refreshToken;
    // نرجع البيانات التي ستحتاجينها في الـ Controller والـ Service
    return { id: payload.sub, email: payload.email, refreshToken };
  }
}

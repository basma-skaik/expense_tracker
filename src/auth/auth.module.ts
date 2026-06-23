import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule, //هنا انا جبته لانه بدي استفيد من الفانكشن كرييت اللي موجودة باليوزر سيرفيس
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Registering JwtModule and configuring it with the secret key from environment variables
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'mysecret',
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN as any) || '15m' }, // Access token short lifespan
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}

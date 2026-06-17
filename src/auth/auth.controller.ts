import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    return this.authService.register(registerDTO);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDTO: LoginDto) {
    return this.authService.login(loginDTO);
  }

  // 1. Protect the logout endpoint using our JwtAuthGuard
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: any) {
    // 2. Thanks to JwtStrategy, the logged-in user data is inside req.user
    const userId = req.user.id;
    return this.authService.logout(userId);
  }
}

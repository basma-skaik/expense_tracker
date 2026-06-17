import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dto/register.dto';
import { User } from 'src/users/user.model';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // Inject UsersService to interact with the users table via database queries
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerDTO: RegisterDTO,
  ): Promise<{ message: string; user: User }> {
    // هنا بنضيف البروميس عشان الكونترولر بس يقرا هاي الفانكشن يشوف انو هي عبارة عن فانكشن بتحتاج وقت .. الكونترولر نفسه ما بشوف ال await اللي جوة الفانكشن
    const { fullName, email, password } = registerDTO;

    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        `User ${existingUser.full_name} Email already exists`,
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await this.usersService.create({
      full_name: fullName,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    return {
      message: 'User registered successfully',
      user: userWithoutPassword as User,
    };
  }

  async login(
    loginDTO: LoginDto,
  ): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const { email, password } = loginDTO;

    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password'); // هنا ما حددت وين الغلط عشان ما اساعد الهاكز المشكلة في وين
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    user.refresh_token = hashedRefreshToken;
    await user.save(); // Save changes to DB

    const userJson = (({ password, refresh_token, ...rest }) => rest)(
      user.toJSON(),
    );

    return {
      user: userJson,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // Helper method to generate both tokens
  private async generateTokens(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const jwtPayload = { sub: userId, email };

    // Sign Access Token (Short-lived based on env or default 15m)
    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.JWT_SECRET || 'mysecret',
      expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
    });

    // Sign Refresh Token (Long-lived, e.g., 7 days)
    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.JWT_REFRESH_SECRET || 'my_super_secret_refresh_key',
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async logout(userId: number): Promise<{ message: string }> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.refresh_token = null;
    await user.save();

    return { message: 'Logged out successfully' };
  }
}

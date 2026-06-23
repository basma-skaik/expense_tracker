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

    // 1. Check if the user exists in the database
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 2. Verify the provided password with the hashed password in DB
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Generate a new token pair (Access & Refresh)
    const tokens = await this.generateTokens(user.id, user.email);

    // 4. Hash and store only the unique JWT Signature to bypass bcrypt's 72-byte limit
    const tokenSignature = tokens.refreshToken.split('.')[2];
    const hashedRefreshToken = await bcrypt.hash(tokenSignature, 10);

    user.refresh_token = hashedRefreshToken;
    await user.save();

    // 5. Exclude sensitive data before returning the user object
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
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });

    return { accessToken, refreshToken };
  }

  async refresh(
    userId: number,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Verify user existence and check if they have an active session
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.refresh_token) {
      throw new UnauthorizedException('Access Denied');
    }

    // 2. Force reload from DB to bypass any caching mechanisms
    await user.reload();

    // 3. Extract the incoming JWT signature from the provided token
    const incomingSignature = refreshToken.split('.')[2];

    // 4. Compare the incoming signature with the hashed signature stored in DB
    const isRefreshTokenMatch = await bcrypt.compare(
      incomingSignature,
      user.refresh_token,
    );

    // 5. Breach Detection: If signatures do not match, reuse is detected!
    if (!isRefreshTokenMatch) {
      // Revoke all sessions by wiping out the refresh token from DB
      user.refresh_token = null;
      await user.save();

      throw new UnauthorizedException(
        'Security Alert: This token has already been used or is invalid. All sessions revoked.',
      );
    }

    // 6. Token Rotation: Generate a fresh pair of tokens
    const tokens = await this.generateTokens(user.id, user.email);

    // 7. Hash the new signature and update the database
    const newSignature = tokens.refreshToken.split('.')[2];
    const hashedRefreshToken = await bcrypt.hash(newSignature, 10);

    user.refresh_token = hashedRefreshToken;
    await user.save();

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
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

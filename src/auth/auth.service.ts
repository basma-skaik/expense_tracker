import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dto/register.dto';
import { User } from 'src/users/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // Inject UsersService to interact with the users table via database queries
  constructor(private readonly usersService: UsersService) {}

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
}

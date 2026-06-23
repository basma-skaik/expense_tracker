import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    // المفروض هنا افحص اذا اليوزر اول موجود او لا و اعتقد هنا حيجي دور الفلتر عشان اوحد الايرورز
    // حيكون فيه زي const user = .. await .. return user
    return this.userModel.findOne({
      where: { email },
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  // هنا برضو رح استخدم اعتقد الDTO و يكون فيه فاليدشن
  async create(userData: {
    full_name: string;
    email: string;
    password: string;
  }): Promise<User> {
    return this.userModel.create(userData);
  }
}

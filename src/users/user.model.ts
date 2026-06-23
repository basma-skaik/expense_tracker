import { Table, Column, Model, DataType } from 'sequelize-typescript';

// 1. جميع الحقول التي ستكون موجودة في السجل بعد جلب البيانات
interface UserAttributes {
  id: number;
  full_name: string;
  email: string;
  password: string;
  refresh_token: string | null;
  created_at?: Date;
  updated_at?: Date;
}

// 2. الحقول المطلوبة فقط عند إنشاء حساب جديد (id و refresh_token اختيارية أو تلقائية)
interface UserCreationAttributes {
  full_name: string;
  email: string;
  password: string;
  refresh_token?: string | null;
}

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  declare id: number; //هنا حطينا ديكلير عشان كلاس المودل اوريدي بكون فيه انستانس id فهنا عرفناها للي بدنا اياه احنا

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare full_name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true, // Allowed null because it's empty until user logs in
  })
  declare refresh_token: string | null;
}

import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class User extends Model<User> {
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
  full_name!: string; // We put ! because at first full_name = undefined but I gurantee that I will give it a value later at the runtime.

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  password!: string;
}

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

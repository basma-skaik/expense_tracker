import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/user.model';

// قمنا بتعطيل الـ timestamps لانه ما بلزمنا نعمل كريت ات و ابديت ات
@Table({ tableName: 'expense_transactions', timestamps: false })
export class ExpenseTransaction extends Model<ExpenseTransaction> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  })
  declare id: number;

  @Column({
    type: DataType.DECIMAL(12, 2),
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare description: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare transaction_date: Date;

  @Column({
    type: DataType.ENUM(
      'Food',
      'Transportation',
      'Housing',
      'Utilities',
      'Healthcare',
    ),
    allowNull: false,
  })
  declare expense_category: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'user_id', // يضمن الربط الصحيح مع اسم العمود في الـ Migration
  })
  declare user_id: number;

  @BelongsTo(() => User)
  declare user: User;
}

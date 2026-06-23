import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseTransactionDto } from './dto/create-expense-transaction.dto';
// import { UpdateExpenseTransactionDto } from './dto/update-expense-transaction.dto';
import { InjectModel } from '@nestjs/sequelize';
import { ExpenseTransaction } from './expense-transaction.model';

@Injectable()
export class ExpenseTransactionsService {
  constructor(
    @InjectModel(ExpenseTransaction)
    private readonly expenseTransactionModel: typeof ExpenseTransaction,
  ) {}

  async findOne(id: number, userId: number): Promise<ExpenseTransaction> {
    const transaction = await this.expenseTransactionModel.findOne({
      where: { id, user_id: userId },
    });

    if (!transaction) {
      throw new NotFoundException(
        `Expense transaction with ID ${id} not found`,
      );
    }

    return transaction;
  }

  async create(
    createDto: CreateExpenseTransactionDto,
    userId: number,
  ): Promise<ExpenseTransaction> {
    return await this.expenseTransactionModel.create({
      amount: createDto.amount,
      description: createDto.description ?? null,
      transaction_date: new Date(createDto.transaction_date),
      expense_category: createDto.expense_category,
      user_id: userId,
    });
  }

  async findAll(userId: number): Promise<ExpenseTransaction[]> {
    return await this.expenseTransactionModel.findAll({
      where: { user_id: userId },
    });
  }

  // update(id: number, updateExpenseTransactionDto: UpdateExpenseTransactionDto) {
  //   return `This action updates a #${id} expenseTransaction`;
  // }

  async remove(id: number, userId: number): Promise<void> {
    const transaction = await this.findOne(id, userId);

    await transaction.destroy();
  }
}

import { Module } from '@nestjs/common';
import { ExpenseTransactionsService } from './expense-transactions.service';
import { ExpenseTransactionsController } from './expense-transactions.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExpenseTransaction } from './expense-transaction.model';

@Module({
  imports: [SequelizeModule.forFeature([ExpenseTransaction])],
  controllers: [ExpenseTransactionsController],
  providers: [ExpenseTransactionsService],
})
export class ExpenseTransactionsModule {}

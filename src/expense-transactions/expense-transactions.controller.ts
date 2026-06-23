import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { ExpenseTransactionsService } from './expense-transactions.service';
import { CreateExpenseTransactionDto } from './dto/create-expense-transaction.dto';
// import { UpdateExpenseTransactionDto } from './dto/update-expense-transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('expense-transactions')
@UseGuards(JwtAuthGuard)
export class ExpenseTransactionsController {
  constructor(
    private readonly expenseTransactionsService: ExpenseTransactionsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateExpenseTransactionDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return await this.expenseTransactionsService.create(createDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: any) {
    const userId = req.user.id;
    return await this.expenseTransactionsService.findAll(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    // تحويل الـ id من string إلى number
    return await this.expenseTransactionsService.remove(+id, userId);
  }
}

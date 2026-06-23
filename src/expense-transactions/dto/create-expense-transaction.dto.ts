import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  Min,
} from 'class-validator';

export class CreateExpenseTransactionDto {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString(
    {},
    { message: 'Transaction date must be a valid ISO date string' },
  )
  transaction_date!: string;

  @IsNotEmpty()
  @IsEnum(['Food', 'Transportation', 'Housing', 'Utilities', 'Healthcare'], {
    message: 'Category must be one of the predefined common categories',
  })
  expense_category!: string;
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExpenseTransactionsModule } from './expense-transactions/expense-transactions.module';
@Module({
  imports: [
    // this line to make sure .env file load globally in the project
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true, // Automatically registers models from modules
      synchronize: false, // this Set to false to prioritize explicit migrations
    }),
    UsersModule,
    AuthModule,
    ExpenseTransactionsModule,
  ],
})
export class AppModule {}

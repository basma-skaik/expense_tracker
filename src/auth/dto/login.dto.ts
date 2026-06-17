import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  // Added: Regex validation to ensure the password contains at least 2 special characters
  @Matches(/([^a-zA-Z0-9].*){2,}/, {
    message:
      'Password must contain at least 2 special characters (e.g., @, #, $, !)',
  })
  password!: string;
}

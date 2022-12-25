import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(320) // the maximum length of an email
  @ApiProperty({ example: 'email@gmail.com' })
  email: string;

  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(6)
  @ApiProperty({ example: '5tr0nGPa$$w0rd123!' })
  password: string;

  @IsNotEmpty()
  @MaxLength(255)
  @IsAlphanumeric()
  @ApiProperty({ example: 'user123' })
  username: string;
}

export class LoginRequestDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(320) // the maximum length of an email
  @ApiProperty({ example: 'email@gmail.com' })
  email: string;

  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(6)
  @ApiProperty({ example: '5tr0nGPa$$w0rd123!' })
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: '63a813ae7e0e90f0ad17158h' })
  id: string;

  @ApiProperty({ example: 'email@gmail.com' })
  email: string;

  @ApiProperty({ example: 'user123' })
  username: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Uses JSON Web Token standard, https://jwt.io/',
  })
  accessToken: string;
}

export class UnauthorizedErrorDto {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'invalid credentials' })
  message: string;

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}

export class ConflictErrorDto {
  @ApiProperty({ example: 409 })
  statusCode: number;

  @ApiProperty({ example: 'user already exists' })
  message: string;

  @ApiProperty({ example: 'Confict' })
  error: string;
}

export class ValidationErrorDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    example: [
      'password must be longer than or equal to 6 characters',
      'password must be shorter than or equal to 255 characters',
      'password should not be empty',
    ],
  })
  message: Array<string>;

  @ApiProperty({ example: 'Bad request' })
  error: string;
}

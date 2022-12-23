import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AuthResponseDto,
  ConflictErrorDto,
  LoginRequestDto,
  RegisterRequestDto,
  UnauthorizedErrorDto,
  ValidationErrorDto,
} from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Authenticates the user.',
    description: 'Authenticates the user, returns an access token.',
  })
  @ApiOkResponse({
    description: "The user's been successfully authenticated.",
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials.',
    type: UnauthorizedErrorDto,
  })
  async login(@Body() loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registers a new user.',
    description:
      'Creates a new user and returns an access token, it also handles validation for already existing users.',
  })
  @ApiCreatedResponse({
    description: "The user's been created.",
    type: AuthResponseDto,
  })
  @ApiConflictResponse({
    description: 'The user already exists.',
    type: ConflictErrorDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error.',
    type: ValidationErrorDto,
  })
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }
}

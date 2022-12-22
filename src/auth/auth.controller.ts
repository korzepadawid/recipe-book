import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
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
  @ApiBadRequestResponse({ description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    return new AuthResponseDto();
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
  })
  @ApiBadRequestResponse({ description: 'Validation error.' })
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<AuthResponseDto> {
    return new AuthResponseDto();
  }
}

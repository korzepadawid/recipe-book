import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(
    registerRequestDto: RegisterRequestDto,
  ): Promise<AuthResponseDto> {
    const alreadyExstingUser = await this.usersService.findByEmailOrUsername({
      email: registerRequestDto.email,
      username: registerRequestDto.username,
    });

    if (alreadyExstingUser) {
      throw new ConflictException('user already exists');
    }

    const { email, username } = await this.usersService.save({
      ...registerRequestDto,
    });

    return { ...new AuthResponseDto(), username, email };
  }

  async login(loginRequestDto: LoginRequestDto): Promise<AuthResponseDto> {
    // todo
    return new AuthResponseDto();
  }
}

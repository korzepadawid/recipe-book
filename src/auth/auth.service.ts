import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.schema';
import { UsersService } from 'src/users/users.service';
import {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
} from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * The method validates and creates a new user with the given details.
   * @throws ConflictException when user already exists
   * @param registerRequestDto user details required for the registration process
   * @returns the freshly created user with access token
   */
  async register(
    registerRequestDto: RegisterRequestDto,
  ): Promise<AuthResponseDto> {
    const userAlreadyExists = await this.usersService.findByEmailOrUsername({
      email: registerRequestDto.email,
      username: registerRequestDto.username,
    });

    if (userAlreadyExists) {
      throw new ConflictException('user already exists');
    }

    const user = await this.usersService.save({
      ...registerRequestDto,
    });

    return this.mapUserToAuthDto(
      user,
      this.jwtService.sign({ id: user._id.toString() }),
    );
  }

  /**
   * The method authenticates the user and returns the access token.
   * @throws ForbiddenException when invalid credentials.
   * @param  LoginRequestDto user's credentials
   * @returns the user details with the access token
   */
  async login({ email, password }: LoginRequestDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    const match = await this.usersService.passwordMatches({
      plainText: password,
      hash: user.password,
    });

    if (!match) {
      throw new UnauthorizedException('invalid credentials');
    }

    return this.mapUserToAuthDto(
      user,
      this.jwtService.sign({ id: user._id.toString() }),
    );
  }

  /**
   * The method maps the user into the auth response.
   * @param User
   * @returns the auth response with user details and access token
   */
  mapUserToAuthDto = (
    { username, email }: User,
    accessToken: string,
  ): AuthResponseDto => ({
    ...new AuthResponseDto(),
    username,
    email,
    accessToken,
  });
}

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';

const BCRYPT_SALT = 10;

interface IFindByEmailOrUsername {
  email: string;
  username: string;
}

interface ICreateUser {
  email: string;
  username: string;
  password: string;
}

interface IPasswordMatches {
  plainText: string;
  hash: string;
}

const generateHashKeyForUser = (email: string, username: string) =>
  `${email}-${username}`;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  /**
   * The method hashes a password(with bcrypt) and saves a user to the database.
   * @param newUser a user to save
   * @returns a freshly created user
   */
  async save(newUser: ICreateUser): Promise<UserDocument> {
    const hashedPassword = await bcrypt.hash(newUser.password, BCRYPT_SALT);
    const user = { ...newUser, password: hashedPassword };
    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();
    return savedUser;
  }

  /**
   * The method finds a user by email or username.
   * @param emailAndUsername details used to search for a user
   * @returns a user that matches the search criteria
   */
  async findByEmailOrUsername({
    email,
    username,
  }: IFindByEmailOrUsername): Promise<UserDocument | undefined> {
    const cachedUser: UserDocument = await this.cache.get(
      generateHashKeyForUser(email, username),
    );
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userModel
      .findOne({ $or: [{ email }, { username }] })
      .exec();

    if (user) {
      await this.cache.set(
        generateHashKeyForUser(user.email, user.username),
        user,
      );
    }
    return user;
  }

  /**
   * The method finds a user by the given email.
   * @param email user's email
   * @returns the user with the give email
   */
  async findByEmail(email: string): Promise<UserDocument | undefined> {
    const cachedUser: UserDocument = await this.cache.get(email);
    if (cachedUser) {
      return cachedUser;
    }
    const user = await this.userModel.findOne({ email }).exec();
    if (user) {
      await this.cache.set(user.email, user);
    }
    return user;
  }

  /**
   * Verifies the hash with the password.
   * @param IPasswordMatches the plain text password and the hashed password
   * @returns true when match, false otherwise
   */
  async passwordMatches({
    plainText,
    hash,
  }: IPasswordMatches): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}

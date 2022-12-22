import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

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

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * The method hashes a password(with bcrypt) and saves a user to the database.
   * @param newUser a user to save
   * @returns a freshly created user
   */
  async save(newUser: ICreateUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(newUser.password, BCRYPT_SALT);
    const user = { ...newUser, password: hashedPassword };
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }

  /**
   * The method finds a user by email or a username.
   * @param emailAndUsername details used to search for a user
   * @returns a user that matches the search criteria
   */
  async findByEmailOrUsername({
    email,
    username,
  }: IFindByEmailOrUsername): Promise<User> {
    return this.userModel.findOne({ $or: [{ email }, { username }] }).exec();
  }
}

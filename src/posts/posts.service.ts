import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { PostResponseDto } from './post.dto';
import { Post, PostDocument } from './post.schema';

interface ICreatePost {
  text: string;
  author: Types.ObjectId;
  inReplyTo?: Types.ObjectId;
}

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  /**
   * The method either creates a new post or replies to the old one.
   * @param ICreatePost the post details, like text, author and
   * (optional) parent post id.
   * @returns the saved post details
   */
  async createPost({
    text,
    author,
    inReplyTo, // optional
  }: ICreatePost): Promise<PostResponseDto> {
    const post = { text, author, inReplyTo, history: [] };
    const createdPost = new this.postModel(post);
    const savedPost = await createdPost.save();
    return this.mapPostToDto(savedPost);
  }

  /**
   *
   * @param id
   * @returns
   */
  async findPostById(id: string): Promise<PostResponseDto> {
    const convertedId = this.convertStringToMongoId(id);
    const post = await this.postModel.findById(convertedId);
    if (!post) {
      throw new NotFoundException('post not found');
    }
    return this.mapPostToDto(post);
  }

  /**
   * The method maps the post entity into the dto.
   * @param PostDocument post from the database
   * @returns a dto representation of the post
   */
  mapPostToDto = ({ _id, inReplyTo, history, text, author }: PostDocument) => ({
    ...new PostResponseDto(),
    id: _id.toString(),
    inReplyTo:
      typeof inReplyTo !== 'undefined'
        ? (inReplyTo as PostDocument)._id.toString()
        : null,
    history,
    text,
    author: (author as UserDocument)._id.toString(),
  });

  convertStringToMongoId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('post not found');
    }
    return new Types.ObjectId(id);
  }
}

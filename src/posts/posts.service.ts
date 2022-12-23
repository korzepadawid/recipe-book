import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
    await createdPost.save();
    return new PostResponseDto();
  }
}

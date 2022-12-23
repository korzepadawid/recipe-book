import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true, collection: 'posts' })
export class Post {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  history: Array<string>;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  author: User;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Post.name,
  })
  inReplyTo: Post;
}

export const PostSchema = SchemaFactory.createForClass(Post);

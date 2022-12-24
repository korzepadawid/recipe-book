import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/user.schema';

export type RecipeDocument = HydratedDocument<Recipe>;

@Schema({ timestamps: true, collection: 'recipes' })
export class Recipe {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  steps: string[];

  @Prop()
  ingredients: string[];

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  author: User;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);

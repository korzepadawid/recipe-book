import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/user.schema';
import { Recipe, RecipeDocument } from './recipe.schema';

@Injectable()
export class RecipeOwnerGuard implements CanActivate {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  /**
   * The method validates request. A recipe can be accessed only if it belongs to a user.
   * @param req request
   * @returns boolean which specifies if a user can access a requested resource
   */
  async validateRequest(req: any): Promise<boolean> {
    const { id: userId } = req.user;
    if (!userId) {
      return false;
    }
    const { id: recipeId } = req.params;
    const recipe = await this.recipeModel.findById(recipeId);
    if (!recipe) {
      return true;
    }
    return (recipe.author as UserDocument)._id.toString() === userId;
  }
}

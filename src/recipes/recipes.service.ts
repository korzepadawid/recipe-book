import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  RecipePageDto,
  RecipePageQueryDto,
  RecipeRequestDto,
  RecipeResponseDto,
  RecipeUpdateRequestDto,
} from './recipe.dto';
import { Recipe, RecipeDocument } from './recipe.schema';
import { Cache } from 'cache-manager';

const PAGE_LIMIT = 5;

interface ICreateRecipe {
  recipeRequestDto: RecipeRequestDto;
  userId: string;
}

export interface IFindSingleRecipePage {
  recipePageQueryDto: RecipePageQueryDto;
}

const getPageOffset = (page: number): number => (page - 1) * PAGE_LIMIT;

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  /**
   * The method creates a new recipe from the the given details (description, title etc. author id).
   * @param ICreateRecipe the recipe details (description, title etc.) and the user's id
   * @returns a dto representation of the recipe
   */
  async create({
    recipeRequestDto,
    userId,
  }: ICreateRecipe): Promise<RecipeResponseDto> {
    const recipe = new this.recipeModel({
      ...recipeRequestDto,
      author: new Types.ObjectId(userId),
    });
    const savedRecipe = await recipe.save();
    const recipeDto = this.mapRecipeToDto(savedRecipe);
    await this.cache.set(savedRecipe._id.toString(), recipeDto);
    return recipeDto;
  }

  /**
   * The method returns a paginated recipes.
   * @param number a number of the page
   * page [1, ∞+)
   * @returns the requested page
   */
  async findAll(page: number): Promise<RecipePageDto> {
    const current = Math.max(1, page);
    const recipeLimited = await this.recipeModel
      .find()
      .sort()
      .skip(getPageOffset(current))
      .limit(PAGE_LIMIT)
      .exec();
    const last = await this.getLastPageNumber();
    return {
      data: recipeLimited.map(this.mapRecipeToDto),
      page: {
        limit: PAGE_LIMIT,
        current,
        last,
      },
    };
  }

  /**
   * The method finds recipe by its id, otherwise it throws NotFoundException.
   * @param id
   * @returns a dto representation of the recipe with the given id
   */
  async findById(id: string): Promise<RecipeResponseDto> {
    const cachedRecipe: RecipeResponseDto = await this.cache.get(id);
    if (cachedRecipe) {
      return cachedRecipe;
    }
    const recipe = await this.findRecipeByIdOrThrow(id);
    const recipeDto = this.mapRecipeToDto(recipe);
    await this.cache.set(id, recipeDto);
    return recipeDto;
  }

  /**
   *
   * @param id
   * @param recipeUpdates
   */
  async update(
    id: string,
    recipeUpdates: RecipeUpdateRequestDto,
  ): Promise<void> {
    const recipe = await this.findRecipeByIdOrThrow(id);
    const { description, ingredients, steps, title } = recipeUpdates;

    if (description) {
      recipe.description = description;
    }

    if (ingredients) {
      recipe.ingredients = ingredients;
    }

    if (steps) {
      recipe.steps = steps;
    }

    if (title) {
      recipe.title = title;
    }

    await recipe.save();

    const recipeDto = this.mapRecipeToDto(recipe);
    await this.cache.set(id, recipeDto);
  }

  /**
   * The method removes a recipe by its id. It's no-op if there's no such item.
   * @param id the recipe's id
   */
  async remove(id: string): Promise<void> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (recipe) {
      await recipe.delete();
      await this.cache.del(id);
    }
  }

  /**
   * The method returns all recipes created by the given user.
   * @param userId
   * @returns all recipes created by the given user
   */
  async findAllByUserId(userId: string): Promise<RecipeResponseDto[]> {
    const recipes = await this.recipeModel.find({ author: userId }).exec();
    return recipes.map(this.mapRecipeToDto);
  }

  /**
   * The method returns a recipe with the given id, othwerwise throws an error.
   * @throws NotFoundException when recipe doesn't exist
   * @param id an id of the requested recipe
   * @returns a recipe with the given id
   */
  async findRecipeByIdOrThrow(id: string): Promise<RecipeDocument> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) {
      throw new NotFoundException('recipe not found');
    }
    return recipe;
  }

  /**
   * The method returns the number of the last page.
   * @returns the number of the last page
   */
  async getLastPageNumber(): Promise<number> {
    const total = await this.recipeModel.countDocuments().exec();
    const div = Math.floor(total / PAGE_LIMIT);
    if (total != 0 && total % PAGE_LIMIT == 0) {
      return div;
    }
    return div + 1;
  }

  /**
   * The method maps the recipe into the dto representation.
   * @param RecipeDocument the recipe
   * @returns a dto representation of the recipe
   */
  mapRecipeToDto = ({
    _id,
    title,
    description,
    ingredients,
    steps,
  }: RecipeDocument): RecipeResponseDto => ({
    ...new RecipeResponseDto(),
    id: _id.toString(),
    title,
    description,
    ingredients,
    steps,
  });
}

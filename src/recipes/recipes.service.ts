import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  PageDetails,
  RecipePageDto,
  RecipePageQueryDto,
  RecipeRequestDto,
  RecipeResponseDto,
} from './recipe.dto';
import { Recipe, RecipeDocument } from './recipe.schema';

interface ICreateRecipe {
  recipeRequestDto: RecipeRequestDto;
  userId: string;
}

export interface IFindSingleRecipePage {
  recipePageQueryDto: RecipePageQueryDto;
}

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<RecipeDocument>,
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
    return this.mapRecipeToDto(savedRecipe);
  }

  /**
   * The method returns a paginated recipes.
   * @param IFindSingleRecipePage the details of the requested page.
   * skip [0, ∞+), limit [1, 30]
   * @returns the requested page
   */
  async findAll({
    recipePageQueryDto,
  }: IFindSingleRecipePage): Promise<RecipePageDto> {
    const page = await this.getPageDetails(recipePageQueryDto);
    const recipeLimited = await this.recipeModel
      .find()
      .sort()
      .skip(page.skip)
      .limit(page.limit)
      .exec();
    return {
      data: recipeLimited.map(this.mapRecipeToDto),
      page,
    };
  }

  /**
   * The method finds recipe by its id, otherwise it throws NotFoundException.
   * @throws NotFoundException when recipe does't exist
   * @param id
   * @returns a dto representation of the recipe with the given id
   */
  async findById(id: string): Promise<RecipeResponseDto> {
    const recipe = await this.recipeModel.findById(id).exec();
    if (!recipe) {
      throw new NotFoundException('recipe not found');
    }
    return this.mapRecipeToDto(recipe);
  }

  async update(id: string, recipeRequestDto: RecipeRequestDto): Promise<void> {
    console.log('not implemented');
  }

  async remove(id: string): Promise<void> {
    console.log('not implemented');
  }

  /**
   * The method returns the details about the given page.
   * @param RecipePageQueryDto recipes to skip and recipe limit on a single page
   * @returns the details of the page
   */
  async getPageDetails({
    skip,
    limit,
  }: RecipePageQueryDto): Promise<PageDetails> {
    const parsedSkip = Math.max(0, skip);
    const parsedLimit = Math.min(30, limit);
    const count = await this.recipeModel.countDocuments().exec();
    return {
      skip: parsedSkip,
      limit: parsedLimit,
      count,
    };
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

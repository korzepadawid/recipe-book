import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecipeResponseDto } from './recipe.dto';
import { RecipesService } from './recipes.service';

@ApiTags('Recipes')
@Controller('users/:userId/recipes')
export class UsersRecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiOkResponse({
    description: 'Success.',
    type: RecipeResponseDto,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Returns recipes created by a user.',
    description: 'Returns recipes created by a user.',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Param('userId') userId: string): Promise<RecipeResponseDto[]> {
    return this.recipesService.findAllByUserId(userId);
  }
}

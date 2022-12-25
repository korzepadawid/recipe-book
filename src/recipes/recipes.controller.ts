import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import {
  NotFoundErrorDto,
  RecipePageDto,
  RecipePageQueryDto,
  RecipeRequestDto,
  RecipeResponseDto,
  UnauthorizedErrorDto,
} from './recipe.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RecipeOwnerGuard } from './recipe.guard';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @ApiCreatedResponse({
    description: 'The recipe has been successfully created.',
    type: RecipeResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
    type: UnauthorizedErrorDto,
  })
  @ApiOperation({
    summary: 'Creates a new recipe.',
    description: 'Validates and creates a new recipe. Authentication required.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body() recipeRequestDto: RecipeRequestDto,
    @Request() req,
  ): Promise<RecipeResponseDto> {
    return this.recipesService.create({
      recipeRequestDto,
      userId: req.user.id,
    });
  }

  @ApiOkResponse({
    description: 'Success.',
    type: RecipePageDto,
  })
  @ApiOperation({
    summary: 'Returns a single page of recipes.',
    description: 'Returns a single page of recipes.',
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Query() recipePageQueryDto: RecipePageQueryDto,
  ): Promise<RecipePageDto> {
    return this.recipesService.findAll({ recipePageQueryDto });
  }

  @ApiOkResponse({
    description: 'Success.',
    type: RecipeResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Recipe not found.',
    type: NotFoundErrorDto,
  })
  @ApiOperation({
    summary: 'Returns a single recipe.',
    description: 'Returns a single recipe.',
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RecipeResponseDto> {
    return this.recipesService.findById(id);
  }

  @ApiOperation({
    summary: 'Updates recipe by its id.',
    description:
      'Updates recipe by its id. Only accessible for the recipe owner.',
  })
  @ApiNoContentResponse({
    description: 'Updated.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
    type: UnauthorizedErrorDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RecipeOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() recipeRequestDto: RecipeRequestDto,
  ): Promise<void> {
    return this.recipesService.update(id, recipeRequestDto);
  }

  @ApiOperation({
    summary: 'Removes a recipe by its id.',
    description:
      'Removes a recipe by its id. Only accessible for the recipe owner.',
  })
  @ApiNoContentResponse({
    description: 'Deleted.',
  })
  @ApiUnauthorizedResponse({
    description: 'Authentication required.',
    type: UnauthorizedErrorDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RecipeOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.recipesService.remove(id);
  }
}

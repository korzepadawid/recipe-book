import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, MaxLength, Min } from 'class-validator';

const pizzaSteps = [
  'Preheat the pizza stone (or pizza pan or baking sheet)',
  'Divide the dough into 2 balls',
  'Prep the toppings',
  'Flatten the dough ball, and stretch out into a round',
  'Brush the dough top with olive oil',
  'Sprinkle the pizza peel with cornmeal, put flattened dough on top',
  'Spread with tomato sauce and sprinkle with toppings1 teaspoon sugar',
  'Slide pizza into the oven',
  'Bake',
];

const pizzaIngredients = [
  '1 1/2 cups (355 ml) warm water (105°F-115°F)',
  '1 package (2 1/4 teaspoons) active dry yeast',
  '3 3/4 cups (490g) bread flour',
  '2 tablespoons extra virgin olive oil (omit if cooking pizza in a wood-fired pizza oven)',
  '2 teaspoons kosher salt',
  '1 teaspoon sugar',
];

const pizzaDescription =
  'Make perfect pizza at home with this classic homemade pizza recipe, including a pizza dough recipe, topping suggestions, and step-by-step instructions with photos.';

export class RecipeRequestDto {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ example: 'Pizza' })
  title: string;

  @MaxLength(320)
  @ApiProperty({
    example: pizzaDescription,
  })
  description: string;

  @ApiProperty({
    example: pizzaSteps,
  })
  steps: string[];

  @ApiProperty({
    example: pizzaIngredients,
  })
  ingredients: string[];
}

export class RecipeUpdateRequestDto {
  @MaxLength(255)
  @ApiProperty({ example: 'Pizza' })
  title: string;

  @MaxLength(320)
  @ApiProperty({
    example: pizzaDescription,
  })
  description: string;

  @ApiProperty({
    example: pizzaSteps,
  })
  steps: string[];

  @ApiProperty({
    example: pizzaIngredients,
  })
  ingredients: string[];
}

export class RecipeResponseDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  id: string;

  @ApiProperty({ example: 'Pizza' })
  title: string;

  @ApiProperty({ example: 'Description' })
  description: string;

  steps: string[];

  ingredients: string[];
}

export class RecipePageQueryDto {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number;
}

export class PageDetails {
  current: number;
  last: number;
  limit: number;
}

export class RecipePageDto {
  page: PageDetails;
  data: RecipeRequestDto[];
}

export class UnauthorizedErrorDto {
  @ApiProperty({ example: 401 })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  message: string;
}

export class NotFoundErrorDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'recipe not found' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}

export class ForbiddenErrorDto {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty({ example: 'Forbidden resource' })
  message: string;

  @ApiProperty({ example: 'Forbidden' })
  error: string;
}

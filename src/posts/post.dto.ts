import { IsNotEmpty, MaxLength } from 'class-validator';

export class PostRequestDto {
  @IsNotEmpty()
  @MaxLength(280)
  text: string;
}

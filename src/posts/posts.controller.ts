import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostRequestDto } from './post.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body() postRequestDto: PostRequestDto,
    @Request() req,
  ): Promise<any> {
    return this.postsService.createPost({
      text: postRequestDto.text,
      author: new mongoose.Types.ObjectId(req.user),
    });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findOnePostsPage(@Request() req): Promise<any> {
    return req.user;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOnePost(@Request() req): Promise<any> {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOnePost(@Request() req): Promise<void> {
    return req.user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOnePost(@Request() req): Promise<void> {
    return req.user;
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { ArticleService } from './article.service'
import { AuthGuard } from '../user/guards/auth.guard'
import { UserDecorator } from '../user/decorators/user.decorator'
import { UserEntity } from '../user/user.entity'
import { ArticleResponseInterface } from './types/articleResponse.interface'
import { CreateArticleDto } from './dto/create-article.dto'
import { ArticlesResponseInterface } from './types/articlesResponse.interface'

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {
  }

  @Get()
  async getAll(
    @UserDecorator('id') currentUserId: number,
    @Query() query: any
  ): Promise<ArticlesResponseInterface> {
    return this.articleService.findAll(currentUserId, query)
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @UserDecorator() currentUser: UserEntity,
    @Body('article') createArticleDto: CreateArticleDto
  ): Promise<ArticleResponseInterface> {

    const article = await this.articleService.createArticle(currentUser, createArticleDto)

    return this.articleService.buildArticleResponse(article)
  }

  @Get(':slug')
  async getArticle(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
    const article = await this.articleService.getArticle(slug)
    return this.articleService.buildArticleResponse(article)
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteArticle(@UserDecorator('id') currentUserId: number, @Param('slug') slug: string) {
    return await this.articleService.deleteArticle(slug, currentUserId)
  }

  @Put(':slug')
  @UseGuards(AuthGuard)
  async updateArticle(
    @UserDecorator('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: CreateArticleDto
  ): Promise<ArticleResponseInterface> {
    const article = await this.articleService.updateArticle(slug, currentUserId, updateArticleDto)
    return this.articleService.buildArticleResponse(article)
  }
}

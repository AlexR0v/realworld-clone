import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ArticleEntity } from './article.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, getRepository, Repository } from 'typeorm'
import { UserEntity } from '../user/user.entity'
import { CreateArticleDto } from './dto/create-article.dto'
import { ArticleResponseInterface } from './types/articleResponse.interface'
import slugify from 'slugify'
import { ArticlesResponseInterface } from './types/articlesResponse.interface'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepo: Repository<ArticleEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>
  ) {
  }

  async findAll(userId: number, query: any): Promise<ArticlesResponseInterface> {
    const queryBuilder = getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author')

    queryBuilder.orderBy('articles.createdAt', 'DESC')
    const articlesCount = await queryBuilder.getCount()

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`
      })
    }

    if (query.author) {
      const author = await this.userRepo.findOne({
        username: query.author
      })
      queryBuilder.andWhere('articles.author = :id', {
        id: author.id
      })
    }

    if (query.limit) {
      queryBuilder.limit(query.limit)
    }

    if (query.offset) {
      queryBuilder.offset(query.offset)
    }

    const articles = await queryBuilder.getMany()

    return { articles, articlesCount }
  }

  async createArticle(user: UserEntity, createArticle: CreateArticleDto): Promise<ArticleEntity> {
    const article = new ArticleEntity()
    Object.assign(article, createArticle)

    if (!article.tagList) {
      article.tagList = []
    }

    article.slug = ArticleService.getSlug(createArticle.title)

    article.author = user
    return await this.articleRepo.save(article)
  }

  async updateArticle(slug: string, userId: number, updateArticle: CreateArticleDto): Promise<ArticleEntity> {
    const article = await this.getArticle(slug)
    if (article.author.id !== userId) {
      throw  new HttpException('You are not author', HttpStatus.FORBIDDEN)
    }
    console.log(updateArticle)
    Object.assign(article, updateArticle)
    return await this.articleRepo.save(article)
  }

  async getArticle(slug: string): Promise<ArticleEntity | undefined> {
    const article = await this.articleRepo.findOne({ slug })

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
    }

    return article
  }

  async deleteArticle(slug: string, id: number): Promise<DeleteResult> {
    const article = await this.getArticle(slug)

    if (article.author.id !== id) {
      throw  new HttpException('You are not author', HttpStatus.FORBIDDEN)
    }

    return await this.articleRepo.delete({ slug })
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return { article }
  }

  private static getSlug(title: string): string {
    return slugify(title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
  }
}

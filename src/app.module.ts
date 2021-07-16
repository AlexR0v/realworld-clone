import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { TagModule } from './tag/tag.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import ormconfig from './ormconfig'
import { AuthMiddleware } from './user/middlewares/auth.middleware'
import { ArticleModule } from './article/article.module';

@Module({
  imports: [ TypeOrmModule.forRoot(ormconfig), TagModule, UserModule, ArticleModule ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}

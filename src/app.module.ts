import { Module } from '@nestjs/common'
import { TagModule } from './tag/tag.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [ TypeOrmModule.forRoot(), TagModule ]
})
export class AppModule {
}

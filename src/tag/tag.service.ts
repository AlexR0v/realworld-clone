import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TagEntity } from './tag.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TagService {
  constructor(@InjectRepository(TagEntity) readonly tagRepo: Repository<TagEntity>) {
  }

  async findAll(): Promise<TagEntity[]> {
    return this.tagRepo.find()
  }
}

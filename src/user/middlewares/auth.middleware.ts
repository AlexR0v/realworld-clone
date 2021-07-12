import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { ExpressRequestInterface } from '../../types/expressRequest.interface'
import { UserService } from '../user.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {
  }

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction): Promise<any> {
    if (!req.headers.authorization) {
      req.user = null
      next()
      return
    }
    const token = req.headers.authorization.split(' ')[1]
    try {
      const decodeUser = await verify(token, 'super-secret')
      req.user = await this.userService.findById(decodeUser.id)
      next()
      return
    } catch (e) {
      req.user = null
      next()
    }
    next()
  }
}

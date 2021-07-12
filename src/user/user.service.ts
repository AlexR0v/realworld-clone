import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UserEntity } from './user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { sign } from 'jsonwebtoken'
import { UserResponseInterface } from './types/userResponse.interface'
import { LoginUserDto } from './dto/login-user.dto'
import { compare } from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) {
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepo.find()
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const existsUserEmail = await this.userRepo.findOne({
      email: user.email
    })
    const existsUsername = await this.userRepo.findOne({
      username: user.username
    })
    if (existsUserEmail || existsUsername) {
      throw new HttpException('Email or username already exist', HttpStatus.UNPROCESSABLE_ENTITY)
    }
    const newUser = new UserEntity()
    Object.assign(newUser, user)
    return await this.userRepo.save(newUser)
  }

  async login(userLogin: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ email: userLogin.email }, {
      select: [ 'id', 'username', 'email', 'bio', 'image', 'password' ]
    })
    const isPassword = await compare(userLogin.password, user.password)
    if (!user) {
      throw new HttpException(`User with email ${userLogin.email} do not exist`, HttpStatus.NOT_FOUND)
    }
    if (!isPassword) {
      throw new HttpException(`Password is incorrect`, HttpStatus.BAD_REQUEST)
    }
    delete user.password
    return user
  }

  async updateUser(id: number, updatedUser: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findById(id)
    Object.assign(user, updatedUser)
    return await this.userRepo.save(user)
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepo.findOne(id)
  }

  generateJWT(user: UserEntity) {
    return sign({
      id: user.id,
      username: user.username,
      email: user.email
    }, 'super-secret')
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJWT(user)
      }
    }
  }
}

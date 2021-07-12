import {
  Body,
  Controller,
  Get,
  Post, Put,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UserResponseInterface } from './types/userResponse.interface'
import { LoginUserDto } from './dto/login-user.dto'
import { UserEntity } from './user.entity'
import { UserDecorator } from './decorators/user.decorator'
import { AuthGuard } from './guards/auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get('users')
  async getAll(): Promise<UserEntity[]> {
    return this.userService.findAll()
  }

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') user: CreateUserDto): Promise<UserResponseInterface> {
    const newUser = await this.userService.createUser(user)
    return this.userService.buildUserResponse(newUser)
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') userLogin: LoginUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.login(userLogin)
    return this.userService.buildUserResponse(user)
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(
    @UserDecorator() user: UserEntity,
  ): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(user)
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @UserDecorator('id') id: number,
    @Body('user') body: UpdateUserDto
  ): Promise<UserResponseInterface> {
    const updatedUser = await this.userService.updateUser(id, body)
    return this.userService.buildUserResponse(updatedUser)
  }
}

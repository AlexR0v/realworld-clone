import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UserResponseInterface } from './types/userResponse.interface'
import { LoginUserDto } from './dto/login-user.dto'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {
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
}

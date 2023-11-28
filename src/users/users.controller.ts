import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const validateUser = (user: Partial<User>) => {
  const { name, email, password } = user;
  const emailRegExp = /(.+)@(.+){2,}\.(.+){2,}/;
  return (typeof name === 'string' && typeof emailRegExp.test(email) && typeof password === 'string'
    && name !== '' && email !== '' && password !== '');
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const isUserValid = validateUser(createUserDto);
    if (isUserValid) {
      await this.usersService.create(createUserDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          tex: 'User Created Successfully',
        },
      };
    }
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid user data',
    };
  }

  @Get()
  async findAll() {
    console.log('Inside findAll====');
    const users = await this.usersService.findAll();
    console.log('Inside findAll users====', users);
    if (users.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: users,
      };
    }
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Users not found!',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (user) {
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: user,
      };
    }
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'User not found!',
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const emailRegExp = /(.+)@(.+){2,}\.(.+){2,}/;
    if (emailRegExp.test(updateUserDto.email) || updateUserDto.password !== '') {
      await this.usersService.update(id, updateUserDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'OK',
        data: {
          tex: 'User Updated Successfully!',
        },
      };
    }
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid user data',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

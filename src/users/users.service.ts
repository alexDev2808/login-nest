import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument> ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password,10)
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword
      });
      return await newUser.save();
    } catch (error) {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({email});
      const isPasswordValid = await bcrypt.compare(password, user.password )
      if(!isPasswordValid) {
        throw new HttpException('No existe', HttpStatus.UNAUTHORIZED);
      }
      if(user && isPasswordValid) {
        const { email, name } = user;
        return { email, name }
      }

    } catch (error) {
      throw new HttpException('No existe', HttpStatus.UNAUTHORIZED);
    }
  }
}

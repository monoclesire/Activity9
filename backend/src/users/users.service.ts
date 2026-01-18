// src/users/users.service.ts
import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ message: string; user: Partial<User> }> {
    console.log('📝 Registration attempt for:', createUserDto.email);
    
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      console.log('❌ User already exists:', createUserDto.email);
      throw new ConflictException('This email is already registered. Please log in with your existing credentials.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    console.log('🔒 Password hashed successfully');

    // Determine role based on email
    const role = createUserDto.email === 'admin@admin.com' ? 'admin' : 'user';

    const user = this.usersRepository.create({
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: hashedPassword,
      role: role,
    });

    const savedUser = await this.usersRepository.save(user);
    console.log('✅ User saved to database:', savedUser.id, 'Role:', savedUser.role);

    const { password, ...result } = savedUser;
    return {
      message: 'Registration successful! Please log in with your credentials.',
      user: result,
    };
  }

  async login(loginDto: LoginDto): Promise<{ message: string; user: Partial<User> }> {
    console.log('🔐 Login attempt for:', loginDto.email);
    
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      console.log('❌ User not found:', loginDto.email);
      throw new UnauthorizedException('Invalid email or password');
    }

    console.log('👤 User found in database:', user.email);
    console.log('🔍 Comparing passwords...');

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Password mismatch for:', loginDto.email);
      throw new UnauthorizedException('Invalid email or password');
    }

    console.log('✅ Login successful for:', user.email, 'Role:', user.role);
    const { password, ...result } = user;
    return {
      message: 'Login successful!',
      user: result,
    };
  }
}
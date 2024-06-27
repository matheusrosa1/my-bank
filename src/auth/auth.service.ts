import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/create-auth.dto';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn({ username, password }: SignInDto): Promise<{ token: string }> {
    const user = await this.usersService.findByUserName(username);

    const decodedPassword = compareSync(password, user.password);

    if (!decodedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.username };
    const token = await this.jwtService.signAsync(payload);
    console.log(token);
    return { token };
  }
}

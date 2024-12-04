import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientsService } from 'src/clients/clients.service';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class AuthService {
  constructor(
    private clientsService: ClientsService,
    private jwtService: JwtService,
  ) {}

  async signIn(authLoginDto: AuthLoginDto): Promise<{
    access_token: string;
    client: Pick<Client, 'email' | 'id' | 'rsaPin' | 'surname'>;
  }> {
    const { email, password: pass } = authLoginDto;

    const client = await this.clientsService.findByEmail(email);
    if (!client) throw new NotFoundException('Client not found!');

    const isMatch = await bcrypt.compare(pass, client.password);

    if (!isMatch) {
      throw new UnauthorizedException('Please use a valid email and password');
    }

    const payload = { sub: client.id, username: client.email };

    const { password, ...result } = client;
    return {
      access_token: await this.jwtService.signAsync(payload),
      client: result,
    };
  }
}

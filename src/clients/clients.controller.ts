import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Public()
  @Post('register')
  async registerClient(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.register(createClientDto);
  }
}

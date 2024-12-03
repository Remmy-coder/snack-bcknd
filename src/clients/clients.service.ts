import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { Client } from "./entities/client.entity";
import { AbstractService } from "src/common/abstract/abstract.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ClientsService extends AbstractService<Client> {
  constructor(
    @InjectRepository(Client) private readonly clientRepository: Repository<
      Client
    >,
  ) {
    super(clientRepository);
  }
  async findByEmail(email: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { email: email },
    });

    return client;
  }

  async register(createClientDto: CreateClientDto): Promise<Client> {
    const existingClient = await this.findByEmail(createClientDto.email);
    if (existingClient) {
      throw new ConflictException("Client with this email already exists");
    }

    try {
      const client = new Client();
      client.surname = createClientDto.surname;
      client.email = createClientDto.email;
      client.password = createClientDto.password;
      client.rsaPin = createClientDto.rsaPin;

      return await this.clientRepository.save(client);
    } catch (error) {
      throw new BadRequestException("Registration failed");
    }
  }
}

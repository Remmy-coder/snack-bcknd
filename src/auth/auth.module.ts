import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ClientsModule } from "src/clients/clients.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "src/clients/entities/client.entity";
import { ClientsService } from "src/clients/clients.service";

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [AuthController],
  providers: [AuthService, ClientsService],
})
export class AuthModule {}

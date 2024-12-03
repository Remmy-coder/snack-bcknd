import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule } from "./clients/clients.module";
import { AuthModule } from './auth/auth.module';
import * as path from "path";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: +process.env.DATABASE_PORT,
      username: String(process.env.POSTGRES_USER),
      password: String(process.env.POSTGRES_PASSWORD),
      database: String(process.env.POSTGRES_DB),
      entities: [
        path.join(__dirname, "**", "*.entity{.ts,.js}"),
      ],
      migrations: [path.join(__dirname, "migrations/*{.ts,.js}")],
    }),
    ClientsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

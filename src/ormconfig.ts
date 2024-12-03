import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config();

export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    path.join(__dirname, "**", "*.entity{.ts,.js}"),
  ],
  migrations: [path.join(__dirname, "migrations/*{.ts,.js}")],
  migrationsTableName: "migrations",
  synchronize: false,
  logging: true,
});
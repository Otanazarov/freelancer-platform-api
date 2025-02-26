import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { env } from "../config/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const mainDbConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    autoLoadEntities: true,
    synchronize: env.DB_SYNC, 
  };
  
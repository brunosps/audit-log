import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { Entity } from 'src/entities/entity.model';
import { MinhaTabela } from 'src/entities/minha-tabela.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      models: [Entity, MinhaTabela],
      autoLoadModels: true,
      synchronize: false,
    }),
  ],
})
export class DatabaseModule { }
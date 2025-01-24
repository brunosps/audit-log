import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';

import { Entity } from './entities/entity.model';
import { AuditLogModule } from './audit-log/audit-log.module';
import { MinhaTabela } from './entities/minha-tabela.model';
import { RestExampleService } from './rest-example.service';
import { HttpModule } from '@nestjs/axios';
import { SoapExampleService } from './soap-example.service';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    SequelizeModule.forFeature([Entity, MinhaTabela]),
    AuditLogModule.forRoot({
      auditedTables: process.env.AUDIT_TABLES?.split('/').filter((i) => i),
      enableErrorLogging: true,
      enableRequestLogging: true,
      enableIntegrationLogging: true,
      authRoute: {
        path: '/users',
        methods: ['POST'],
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RestExampleService, SoapExampleService],
})
export class AppModule { }

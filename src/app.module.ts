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
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    HttpModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
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
      enableArchive: {
        retentionPeriod: 30, // Manter logs por 30 dias antes de arquivar
        archiveDatabase: {
          dialect: 'postgres',
          host: process.env.ARCHIVE_DB_HOST,
          port: parseInt(process.env.ARCHIVE_DB_PORT),
          username: process.env.ARCHIVE_DB_USERNAME,
          password: process.env.ARCHIVE_DB_PASSWORD,
          synchronize: true,
        },
        batchSize: 1000, // Processar 1000 registros por vez
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RestExampleService, SoapExampleService],
})
export class AppModule { }

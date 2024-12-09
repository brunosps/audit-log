import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';

import { Entity } from './entities/entity.model';
import { AuditModule } from './audit-log/audit.module';
import { MinhaTabela } from './entities/minha-tabela.model';

@Module({
  imports: [
    DatabaseModule,
    SequelizeModule.forFeature([Entity, MinhaTabela]),
    AuditModule.forRoot({
      auditedTables: process.env.AUDIT_TABLES?.split("/").filter(i => i),
      enableErrorLogging: true,
      enableRequestLogging: true,
      authRoute: {
        path: "/users",
        methods: ["POST"]
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

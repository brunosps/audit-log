import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditLogRequest } from './audit-log-request.model';
import { AuditLogEntity } from './audit-log-entity.model';
import { AuditLogError } from './audit-log-error.model';
import { AuditLogEvent } from './audit-log-event.model';
import { AuditLog } from './audit-log.model';
import { AuditLogIntegration } from './audit-log-integration.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AuditLog,
      AuditLogEntity,
      AuditLogRequest,
      AuditLogError,
      AuditLogEvent,
      AuditLogIntegration,
    ]),
  ],
  exports: [SequelizeModule],
})
export class AuditLogModelModule { }

import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuditLogRequest } from './audit-log-access.model';
import { AuditLogEntity } from './audit-log-entity.model';
import { AuditLogError } from './audit-log-error.model';
import { AuditLogEvent } from './audit-log-event.model';
import { AuditLog } from './audit-log.model';

@Module({
    imports: [SequelizeModule.forFeature([AuditLog, AuditLogEntity, AuditLogRequest, AuditLogError, AuditLogEvent])],
    exports: [SequelizeModule],
})
export class AuditModelModule { }

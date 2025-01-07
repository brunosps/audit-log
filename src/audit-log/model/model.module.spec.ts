import { Test } from '@nestjs/testing';
import { AuditModelModule } from './model.module';
import { getModelToken } from '@nestjs/sequelize';
import { AuditLog } from './audit-log.model';
import { AuditLogEntity } from './audit-log-entity.model';
import { AuditLogRequest } from './audit-log-access.model';
import { AuditLogError } from './audit-log-error.model';
import { AuditLogEvent } from './audit-log-event.model';

describe('AuditModelModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditModelModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should provide all audit log models', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditModelModule],
    }).compile();

    expect(module.get(getModelToken(AuditLog))).toBeDefined();
    expect(module.get(getModelToken(AuditLogEntity))).toBeDefined();
    expect(module.get(getModelToken(AuditLogRequest))).toBeDefined();
    expect(module.get(getModelToken(AuditLogError))).toBeDefined();
    expect(module.get(getModelToken(AuditLogEvent))).toBeDefined();
  });
});


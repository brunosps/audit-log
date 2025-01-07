import { Test } from '@nestjs/testing';
import { AuditModule } from './audit.module';
import { AuditService } from './audit.service';
import { AuditRequestModule } from './audit-request.module';
import { AuditErrorModule } from './audit-error.module';
import { AuditDatabaseModule } from './audit-database.module';
import { AuditModelModule } from './model/model.module';

describe('AuditModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditModule.forRoot({})],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should provide AuditService', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditModule.forRoot({})],
    }).compile();

    const auditService = module.get<AuditService>(AuditService);
    expect(auditService).toBeInstanceOf(AuditService);
  });

  it('should import AuditModelModule', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditModule.forRoot({})],
    }).compile();

    expect(module.select(AuditModelModule)).toBeDefined();
  });

  it('should import AuditErrorModule when enableErrorLogging is true', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditModule.forRoot({ enableErrorLogging: true })],
    }).compile();

    expect(module.select(AuditErrorModule)).toBeDefined();
  });

  it('should import AuditRequestModule when enableRequestLogging is true', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditModule.forRoot({ enableRequestLogging: true })],
    }).compile();

    expect(module.select(AuditRequestModule)).toBeDefined();
  });

  it('should import AuditDatabaseModule when auditedTables is not empty', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditModule.forRoot({ auditedTables: ['users'] })],
    }).compile();

    expect(module.select(AuditDatabaseModule)).toBeDefined();
  });

  it('should provide AUDITEDTABLES token', async () => {
    const auditedTables = ['users', 'posts'];
    const module = await Test.createTestingModule({
      imports: [AuditModule.forRoot({ auditedTables })],
    }).compile();

    const providedAuditedTables = module.get('AUDITEDTABLES');
    expect(providedAuditedTables).toEqual(auditedTables);
  });
});


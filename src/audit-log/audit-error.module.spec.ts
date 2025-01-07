import { Test } from '@nestjs/testing';
import { AuditErrorModule } from './audit-error.module';
import { AuditModelModule } from './model/model.module';
import { APP_FILTER } from '@nestjs/core';
import { ErrorLoggingFilter } from './filters/error-logging.filter';

describe('AuditErrorModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditErrorModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should import AuditModelModule', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditErrorModule],
    }).compile();

    expect(module.select(AuditModelModule)).toBeDefined();
  });

  it('should provide ErrorLoggingFilter as APP_FILTER', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditErrorModule],
    }).compile();

    const appFilter = module.get(APP_FILTER);
    expect(appFilter).toBeDefined();
    expect(appFilter.useClass).toBe(ErrorLoggingFilter);
  });
});


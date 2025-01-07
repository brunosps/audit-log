import { Test } from '@nestjs/testing';
import { AuditDatabaseModule } from './audit-database.module';
import { UserSessionMiddleware } from './middleware/user-session.middleware';

describe('AuditDatabaseModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditDatabaseModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should apply UserSessionMiddleware to all routes', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditDatabaseModule],
    }).compile();

    const auditDatabaseModule = module.get<AuditDatabaseModule>(AuditDatabaseModule);
    const consumer = {
      apply: jest.fn().mockReturnThis(),
      forRoutes: jest.fn(),
    };

    auditDatabaseModule.configure(consumer as any);

    expect(consumer.apply).toHaveBeenCalledWith(UserSessionMiddleware);
    expect(consumer.forRoutes).toHaveBeenCalledWith('*');
  });
});


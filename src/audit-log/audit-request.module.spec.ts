import { Test } from '@nestjs/testing';
import { AuditRequestModule } from './audit-request.module';
import { AuditModelModule } from './model/model.module';

describe('AuditRequestModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditRequestModule.forRoot({ path: '/auth', methods: ['POST'] })],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should import AuditModelModule', async () => {
    const module = await Test.createTestingModule({
      imports: [AuditRequestModule.forRoot({ path: '/auth', methods: ['POST'] })],
    }).compile();

    expect(module.select(AuditModelModule)).toBeDefined();
  });

  it('should provide AUTH_ROUTE token', async () => {
    const config = { path: '/auth', methods: ['POST'] };
    const module = await Test.createTestingModule({
      imports: [AuditRequestModule.forRoot(config)],
    }).compile();

    const providedConfig = module.get('AUTH_ROUTE');
    expect(providedConfig).toEqual(config);
  });
});


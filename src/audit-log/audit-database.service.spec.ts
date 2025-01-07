import { Test, TestingModule } from '@nestjs/testing';
import { AuditDatabaseService } from './audit-database.service';
import { Sequelize } from 'sequelize-typescript';

describe('AuditDatabaseService', () => {
  let service: AuditDatabaseService;
  let mockSequelize: jest.Mocked<Sequelize>;

  beforeEach(async () => {
    mockSequelize = {
      query: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditDatabaseService,
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<AuditDatabaseService>(AuditDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBaseTriggers', () => {
    it('should execute base scripts', async () => {
      await service.createBaseTriggers();
      expect(mockSequelize.query).toHaveBeenCalledTimes(6);
    });
  });

  describe('enable', () => {
    it('should enable audit for a table', async () => {
      const getSchemaspy = jest.spyOn(service as any, 'getSchema').mockResolvedValue({
        table: 'users',
        fields: ['id', 'name', 'email'],
        pk: ['id'],
      });
      const disableAuditSpy = jest.spyOn(service as any, 'disbleAudit').mockResolvedValue(undefined);
      const enableAuditSpy = jest.spyOn(service as any, 'enableAudit').mockResolvedValue(undefined);

      await service.enable('users');

      expect(getSchemaspy).toHaveBeenCalledWith('users', []);
      expect(disableAuditSpy).toHaveBeenCalledWith('users');
      expect(enableAuditSpy).toHaveBeenCalledWith({
        table: 'users',
        fields: ['id', 'name', 'email'],
        pk: ['id'],
      });
    });
  });

  describe('disable', () => {
    it('should disable audit for a table', async () => {
      const getSchemaspy = jest.spyOn(service as any, 'getSchema').mockResolvedValue({
        table: 'users',
        fields: ['id', 'name', 'email'],
        pk: ['id'],
      });
      const disableAuditSpy = jest.spyOn(service as any, 'disbleAudit').mockResolvedValue(undefined);

      await service.disable('users');

      expect(getSchemaspy).toHaveBeenCalledWith('users', []);
      expect(disableAuditSpy).toHaveBeenCalledWith('users');
    });
  });

  describe('disableAll', () => {
    it('should disable all audited tables', async () => {
      mockSequelize.query.mockResolvedValueOnce([
        { TABLE_NAME: 'users' },
        { TABLE_NAME: 'posts' },
      ]);
      const disableAuditSpy = jest.spyOn(service as any, 'disbleAudit').mockResolvedValue(undefined);

      await service.disableAll();

      expect(mockSequelize.query).toHaveBeenCalledWith(expect.stringContaining('SELECT DISTINCT EVENT_OBJECT_TABLE'), expect.any(Object));
      expect(disableAuditSpy).toHaveBeenCalledWith('users');
      expect(disableAuditSpy).toHaveBeenCalledWith('posts');
      expect(mockSequelize.query).toHaveBeenCalledWith('DROP FUNCTION IF EXISTS get_table_schema', expect.any(Object));
      expect(mockSequelize.query).toHaveBeenCalledWith('DROP FUNCTION IF EXISTS generate_changed_json', expect.any(Object));
      expect(mockSequelize.query).toHaveBeenCalledWith('DROP FUNCTION IF EXISTS uuid_v4', expect.any(Object));
    });
  });
});


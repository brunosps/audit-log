import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from './audit.service';
import { getModelToken } from '@nestjs/sequelize';
import { AuditLog } from './model/audit-log.model';
import { AuditLogEvent } from './model/audit-log-event.model';
import { AuditLogError } from './model/audit-log-error.model';
import { Sequelize } from 'sequelize-typescript';
import { AuditDatabaseService } from './audit-database.service';

jest.mock('./audit-database.service');

describe('AuditService', () => {
  let service: AuditService;
  let mockSequelize: jest.Mocked<Sequelize>;
  let mockAuditLogModel: jest.Mocked<typeof AuditLog>;
  let mockAuditLogEventModel: jest.Mocked<typeof AuditLogEvent>;
  let mockAuditDatabaseService: jest.Mocked<AuditDatabaseService>;

  beforeEach(async () => {
    mockSequelize = {
      query: jest.fn(),
    } as any;

    mockAuditLogModel = {
      create: jest.fn(),
    } as any;

    mockAuditLogEventModel = {
      create: jest.fn(),
    } as any;

    mockAuditDatabaseService = new AuditDatabaseService(mockSequelize) as jest.Mocked<AuditDatabaseService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: 'AUDITEDTABLES',
          useValue: ['users', 'posts'],
        },
        {
          provide: getModelToken(AuditLog),
          useValue: mockAuditLogModel,
        },
        {
          provide: getModelToken(AuditLogEvent),
          useValue: mockAuditLogEventModel,
        },
        {
          provide: getModelToken(AuditLogError),
          useValue: {},
        },
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    service['auditDatabaseService'] = mockAuditDatabaseService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should enable audit for each audited table', async () => {
      await service.onModuleInit();
      expect(mockAuditDatabaseService.enable).toHaveBeenCalledTimes(2);
      expect(mockAuditDatabaseService.enable).toHaveBeenCalledWith('users');
      expect(mockAuditDatabaseService.enable).toHaveBeenCalledWith('posts');
    });

    it('should log error if enabling audit fails', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      mockAuditDatabaseService.enable.mockRejectedValueOnce(new Error('Test error'));

      await service.onModuleInit();

      expect(consoleLogSpy).toHaveBeenCalledWith('\n\nAuditService ERROR');
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleLogSpy.mockRestore();
    });
  });

  describe('logEvent', () => {
    it('should create audit log and event log', async () => {
      const mockAuditLog = { id: 'mock-audit-log-id' };
      mockAuditLogModel.create.mockResolvedValue(mockAuditLog as any);
      mockAuditLogEventModel.create.mockResolvedValue({ id: 'mock-event-log-id' } as any);

      const result = await service.logEvent('TEST_EVENT', 'Test description', {
        userId: 'user123',
        ip: '127.0.0.1',
        details: { key: 'value' },
      });

      expect(mockAuditLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
        logType: 'EVENT',
        ipAddress: '127.0.0.1',
        userId: 'user123',
      }));

      expect(mockAuditLogEventModel.create).toHaveBeenCalledWith(expect.objectContaining({
        logId: 'mock-audit-log-id',
        eventType: 'TEST_EVENT',
        eventDescription: 'Test description',
        eventDetails: JSON.stringify({ key: 'value' }),
      }));

      expect(result).toEqual({ id: 'mock-event-log-id' });
    });

    it('should use default values when eventDetails is not provided', async () => {
      const mockAuditLog = { id: 'mock-audit-log-id' };
      mockAuditLogModel.create.mockResolvedValue(mockAuditLog as any);
      mockAuditLogEventModel.create.mockResolvedValue({ id: 'mock-event-log-id' } as any);

      await service.logEvent('TEST_EVENT', 'Test description');

      expect(mockAuditLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
        ipAddress: '0.0.0.0',
        userId: '_',
      }));

      expect(mockAuditLogEventModel.create).toHaveBeenCalledWith(expect.objectContaining({
        eventDetails: '{}',
      }));
    });

    it('should handle errors when creating logs', async () => {
      mockAuditLogModel.create.mockRejectedValue(new Error('Database error'));

      await expect(service.logEvent('TEST_EVENT', 'Test description')).rejects.toThrow('Failed to log event');
    });
  });
});


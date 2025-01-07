import { Test, TestingModule } from '@nestjs/testing';
import { RequestLoggingMiddleware } from './request-logging.middleware';
import { AuditLog } from '../model/audit-log.model';
import { AuditLogRequest } from '../model/audit-log-access.model';
import { getModelToken } from '@nestjs/sequelize';

describe('RequestLoggingMiddleware', () => {
  let middleware: RequestLoggingMiddleware;
  let mockAuditLogModel: any;
  let mockAuditLogRequestModel: any;

  beforeEach(async () => {
    mockAuditLogModel = {
      create: jest.fn(),
    };
    mockAuditLogRequestModel = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestLoggingMiddleware,
        {
          provide: getModelToken(AuditLog),
          useValue: mockAuditLogModel,
        },
        {
          provide: getModelToken(AuditLogRequest),
          useValue: mockAuditLogRequestModel,
        },
        {
          provide: 'AUTH_ROUTE',
          useValue: { path: '/auth', methods: ['POST'] },
        },
      ],
    }).compile();

    middleware = module.get<RequestLoggingMiddleware>(RequestLoggingMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should log requests', async () => {
    const mockRequest = {
      method: 'GET',
      originalUrl: '/test',
      ip: '127.0.0.1',
      body: { test: 'data' },
      user: { id: 'user123' },
    };
    const mockResponse: any = {
      statusCode: 200,
      get: jest.fn().mockReturnValue('100'),
      write: jest.fn(),
      end: jest.fn(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'finish') {
          callback();
        }
      }),
    };
    const mockNext = jest.fn();

    mockAuditLogModel.create.mockResolvedValue({ id: 'log123' });

    await middleware.use(mockRequest as any, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockAuditLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
      logType: 'REQUEST',
      ipAddress: '127.0.0.1',
      userId: 'user123',
    }));

    expect(mockAuditLogRequestModel.create).toHaveBeenCalledWith(expect.objectContaining({
      logId: 'log123',
      requestMethod: 'GET',
      requestURL: '/test',
      responseStatus: 200,
      responseSize: 100,
      payload: JSON.stringify({ test: 'data' }),
    }));
  });

  it('should log login requests', async () => {
    const mockRequest = {
      method: 'POST',
      originalUrl: '/auth',
      ip: '127.0.0.1',
      body: { username: 'testuser', password: 'password' },
    };
    const mockResponse: any = {
      statusCode: 200,
      get: jest.fn().mockReturnValue('100'),
      write: jest.fn(),
      end: jest.fn(),
      on: jest.fn().mockImplementation((event, callback) => {
        if (event === 'finish') {
          callback();
        }
      }),
    };
    const mockNext = jest.fn();

    mockAuditLogModel.create.mockResolvedValue({ id: 'log123' });

    await middleware.use(mockRequest as any, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockAuditLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
      logType: 'LOGIN',
      ipAddress: '127.0.0.1',
      userId: '_',
    }));

    expect(mockAuditLogRequestModel.create).toHaveBeenCalledWith(expect.objectContaining({
      logId: 'log123',
      requestMethod: 'POST',
      requestURL: '/auth',
      responseStatus: 200,
      responseSize: 100,
      payload: JSON.stringify({ username: 'testuser', password: '[REDACTED]' }),
    }));
  });
});


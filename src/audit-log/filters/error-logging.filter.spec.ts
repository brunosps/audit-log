import { Test, TestingModule } from '@nestjs/testing';
import { ErrorLoggingFilter } from './error-logging.filter';
import { AuditLog } from '../model/audit-log.model';
import { AuditLogError } from '../model/audit-log-error.model';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';

describe('ErrorLoggingFilter', () => {
  let filter: ErrorLoggingFilter;
  let mockAuditLogModel: any;
  let mockAuditLogErrorModel: any;

  beforeEach(async () => {
    mockAuditLogModel = {
      create: jest.fn(),
    };
    mockAuditLogErrorModel = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ErrorLoggingFilter,
        {
          provide: getModelToken(AuditLog),
          useValue: mockAuditLogModel,
        },
        {
          provide: getModelToken(AuditLogError),
          useValue: mockAuditLogErrorModel,
        },
      ],
    }).compile();

    filter = module.get<ErrorLoggingFilter>(ErrorLoggingFilter);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should log HTTP exceptions', async () => {
    const mockException = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    const mockRequest = {
      ip: '127.0.0.1',
      user: { id: 'user123' },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockHost = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    };

    mockAuditLogModel.create.mockResolvedValue({ id: 'log123' });

    await filter.catch(mockException, mockHost as any);

    expect(mockAuditLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
      logType: 'ERROR',
      ipAddress: '127.0.0.1',
      userId: 'user123',
    }));

    expect(mockAuditLogErrorModel.create).toHaveBeenCalledWith(expect.objectContaining({
      logId: 'log123',
      errorMessage: JSON.stringify('Test error'),
      errorType: 'HttpException',
      stackTrace: expect.any(String),
    }));

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'An unexpected error occurred.',
    });
  });

  it('should log internal server errors', async () => {
    const mockException = new Error('Internal error');
    const mockRequest = {
      ip: '127.0.0.1',
      user: { id: 'user123' },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockHost = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
    };

    mockAuditLogModel.create.mockResolvedValue({ id: 'log123' });

    await filter.catch(mockException, mockHost as any);

    expect(mockAuditLogModel.create).toHaveBeenCalledWith(expect.objectContaining({
      logType: 'ERROR',
      ipAddress: '127.0.0.1',
      userId: 'user123',
    }));

    expect(mockAuditLogErrorModel.create).toHaveBeenCalledWith(expect.objectContaining({
      logId: 'log123',
      errorMessage: JSON.stringify('Internal server error'),
      errorType: 'Error',
      stackTrace: expect.any(String),
    }));

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred.',
    });
  });
});


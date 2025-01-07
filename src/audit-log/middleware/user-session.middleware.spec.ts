import { Test, TestingModule } from '@nestjs/testing';
import { UserSessionMiddleware } from './user-session.middleware';
import { Sequelize } from 'sequelize-typescript';

describe('UserSessionMiddleware', () => {
  let middleware: UserSessionMiddleware;
  let mockSequelize: jest.Mocked<Sequelize>;

  beforeEach(async () => {
    mockSequelize = {
      query: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSessionMiddleware,
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    middleware = module.get<UserSessionMiddleware>(UserSessionMiddleware);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should set user session variables', async () => {
    const mockRequest = {
      user: { id: 'user123' },
      ip: '127.0.0.1',
    };
    const mockResponse = {};
    const mockNext = jest.fn();

    await middleware.use(mockRequest as any, mockResponse as any, mockNext);

    expect(mockSequelize.query).toHaveBeenCalledWith(
      "SET @user_id = 'user123', @user_ip = '127.0.0.1'"
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle guest users', async () => {
    const mockRequest = {
      ip: '127.0.0.1',
    };
    const mockResponse = {};
    const mockNext = jest.fn();

    await middleware.use(mockRequest as any, mockResponse as any, mockNext);

    expect(mockSequelize.query).toHaveBeenCalledWith(
      "SET @user_id = 'guest', @user_ip = '127.0.0.1'"
    );
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle errors when setting session variables', async () => {
    const mockRequest = {
      user: { id: 'user123' },
      ip: '127.0.0.1',
    };
    const mockResponse = {};
    const mockNext = jest.fn();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    mockSequelize.query.mockRejectedValueOnce(new Error('Database error'));

    await middleware.use(mockRequest as any, mockResponse as any, mockNext);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to set user session in MySQL:', expect.any(Error));
    expect(mockNext).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});


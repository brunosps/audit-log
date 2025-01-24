import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectModel } from '@nestjs/sequelize';

import { v4 as uuidv4 } from 'uuid';
import { AuditLogModel } from '../../audit-log-model/audit-log.model';
import { AuditLogErrorModel } from '../../audit-log-model/audit-log-error.model';

@Injectable()
@Catch()
export class AuditLogErrorLoggingFilter implements ExceptionFilter {
  constructor(
    @InjectModel(AuditLogModel) private readonly auditLogModel: typeof AuditLogModel,
    @InjectModel(AuditLogErrorModel)
    private readonly auditLogErrorModel: typeof AuditLogErrorModel,
  ) { }

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';
    const errorType = exception.constructor?.name || 'UnknownError';
    const stackTrace = exception instanceof Error ? exception.stack : null;

    try {
      const auditLog = await this.auditLogModel.create({
        id: uuidv4(),
        logType: 'ERROR',
        ipAddress: req.ip,
        userId: req['user']?.id || '_',
        createdAt: new Date(),
      });

      await this.auditLogErrorModel.create({
        id: uuidv4(),
        logId: auditLog.id,
        errorMessage: JSON.stringify(message),
        errorType: errorType,
        stackTrace: stackTrace,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error saving error log:', error);
    }

    res.status(status).json({
      statusCode: status,
      message: 'An unexpected error occurred.',
    });
  }
}

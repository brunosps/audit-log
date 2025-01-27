import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLogModel } from '../../audit-log-model/audit-log.model';
import { AuditLogRequestModel } from '../../audit-log-model/audit-log-request.model';
import { sanitizePayload } from '../utils/sanitizePayload';
import { AuditRequestModuleOptions } from '../audit-log-request.module';

@Injectable()
export class AuditLogRequestLoggingMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(AuditLogModel) private auditLogModel: typeof AuditLogModel,
    @InjectModel(AuditLogRequestModel)
    private auditLogRequestModel: typeof AuditLogRequestModel,
    @Inject('AUTH_ROUTE') private authRoute: AuditRequestModuleOptions,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    const payload =
      req.body && Object.keys(req.body).length > 0
        ? JSON.stringify(sanitizePayload(req.body))
        : null;
    const originalWrite = res.write;
    const originalEnd = res.end;
    const responseChunks: Buffer[] = [];

    res.write = (
      chunk: any,
      ...args:
        | [callback?: (error?: Error) => void]
        | [encoding: BufferEncoding, callback?: (error?: Error) => void]
    ): boolean => {
      if (chunk) {
        responseChunks.push(
          Buffer.isBuffer(chunk)
            ? chunk
            : Buffer.from(
              chunk,
              typeof args[0] === 'string' ? args[0] : undefined,
            ),
        );
      }
      return originalWrite.call(res, chunk, ...args);
    };

    res.end = (
      chunk?: any,
      encodingOrCallback?: BufferEncoding | (() => void),
      callback?: () => void,
    ): Response<any, Record<string, any>> => {
      if (chunk) {
        responseChunks.push(
          Buffer.isBuffer(chunk)
            ? chunk
            : Buffer.from(
              chunk,
              typeof encodingOrCallback === 'string'
                ? encodingOrCallback
                : undefined,
            ),
        );
      }
      return originalEnd.call(
        res,
        chunk,
        encodingOrCallback,
        callback,
      ) as Response<any, Record<string, any>>;
    };

    res.on('finish', async () => {
      const duration = Date.now() - start;
      const responseBody = Buffer.concat(responseChunks).toString('utf8');
      try {
        const log = await this.auditLogModel.create({
          id: require('uuid').v4(),
          logType: this.isLoginPath(req) ? 'LOGIN' : 'REQUEST',
          ipAddress: req.ip.replace(/^::ffff:/, ''),
          userId: req['user'] ? req['user'].id : '_',
          createdAt: new Date(),
        });

        await this.auditLogRequestModel.create({
          id: require('uuid').v4(),
          logId: log.id,
          requestMethod: req.method,
          requestURL: req.originalUrl,
          responseStatus: res.statusCode,
          responseSize: parseInt(res.get('Content-Length') || '0', 10),
          duration: duration,
          payload: payload,
          responseBody: responseBody,
          createdAt: new Date(),
        });
      } catch (error) {
        console.error('Error logging request:', error);
      }
    });

    next();
  }

  private isLoginPath(req: Request) {
    return (
      req.originalUrl === this.authRoute.path &&
      this.authRoute.methods.includes(req.method)
    );
  }
}

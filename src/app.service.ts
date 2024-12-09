import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AuditLog } from './audit-log/model/audit-log.model';
import { AuditService } from './audit-log/audit.service';

@Injectable()
export class AppService {

  constructor(private readonly auditLogService: AuditService) { }
  getHello(): string {
    this.auditLogService.logEvent('GET_HELLO', 'Retornou Hello');
    this.auditLogService.logEvent('GET_HELLO', 'Retornou Hello', {
      userId: '12345',
      ip: '192.168.0.1',
      details: {
        action: 'User login',
        additionalInfo: {
          browser: 'Chrome',
          os: 'Windows',
        },
      },
    });

    return 'Hello World!';
  }
}

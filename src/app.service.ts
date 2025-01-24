import { Injectable } from '@nestjs/common';
import { AuditLogEventService } from './audit-log/audit-log-event/services/audit-log-event.service';


@Injectable()
export class AppService {
  constructor(private readonly auditEventLogService: AuditLogEventService) { }

  getHello(): string {
    // this.auditEventLogService.logEvent('GET_HELLO', 'Retornou Hello');
    // this.auditEventLogService.logEvent('GET_HELLO', 'Retornou Hello', {
    //   userId: '12345',
    //   ip: '192.168.0.1',
    //   details: {
    //     action: 'User login',
    //     additionalInfo: {
    //       browser: 'Chrome',
    //       os: 'Windows',
    //     },
    //   },
    // });

    return 'Hello World!';
  }
}

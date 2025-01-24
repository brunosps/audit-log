import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditLogEventService } from '../services/audit-log-event.service';
import { AuditLogEventOptions, AUDIT_EVENT_KEY } from '../decorators/audit-log-event.decorator';


@Injectable()
export class AuditLogEventInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    private auditService: AuditLogEventService
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const auditEventOptions = this.reflector.get<AuditLogEventOptions>(
      AUDIT_EVENT_KEY,
      context.getHandler()
    );

    if (!auditEventOptions) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id || '_';
    const ip = request.ip || '0.0.0.0';
    const methodArgs = context.getArgs();

    return next.handle().pipe(
      tap(async (result) => {
        await this.auditService.logEvent(
          auditEventOptions.eventType,
          auditEventOptions.eventDescription,
          {
            userId,
            ip,
            details: {
              params: methodArgs,
              result: result
            }
          }
        );
      })
    );
  }
}


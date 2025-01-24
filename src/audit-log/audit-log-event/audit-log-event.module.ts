import { DynamicModule, Module } from '@nestjs/common';
import { AuditLogEventService } from './services/audit-log-event.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditLogEventInterceptor } from './interceptors/audit-log-event.interceptor';

type AuditLogEventModuleOptions = {
  modelModule: any;
};

@Module({})
export class AuditLogEventModule {
  static forRoot(config: AuditLogEventModuleOptions): DynamicModule {
    return {
      module: AuditLogEventModule,
      imports: [config.modelModule],
      exports: [AuditLogEventService],
      providers: [
        AuditLogEventService,
        {
          provide: APP_INTERCEPTOR,
          useClass: AuditLogEventInterceptor,
        },
      ],
    };
  }
}

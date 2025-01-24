import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AuditLogErrorLoggingFilter } from './filters/audit-log-error-logging.filter';

type AuditLogErrorModuleOptions = {
  modelModule: any;
};

@Module({})
export class AuditLogErrorModule {
  static forRoot(config: AuditLogErrorModuleOptions): DynamicModule {
    return {
      module: AuditLogErrorModule,
      imports: [config.modelModule],
      exports: [],
      providers: [
        {
          provide: APP_FILTER,
          useClass: AuditLogErrorLoggingFilter,
        },
      ],
    };
  }
}

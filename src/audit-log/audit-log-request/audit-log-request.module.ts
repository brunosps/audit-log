import { DynamicModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { AuditLogModelModule } from '../audit-log-model/audit-log-model.module';
import { AuditLogRequestLoggingMiddleware } from './middleware/audit-log-request-logging.middleware';

export type AuditRequestModuleOptions = {
  path: string;
  methods: Array<string>;
};

@Module({})
export class AuditLogRequestModule {
  static forRoot(config: AuditRequestModuleOptions): DynamicModule {
    return {
      module: AuditLogRequestModule,
      imports: [AuditLogModelModule],
      providers: [
        {
          provide: 'AUTH_ROUTE',
          useValue: config,
        },
      ],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditLogRequestLoggingMiddleware).forRoutes('*');
  }
}

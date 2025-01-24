import { DynamicModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { AuditLogUserSessionMiddleware } from './middleware/audit-log-user-session.middleware';
import { AuditLogDatabaseService } from './service/audit-log-database.service';

type AuditDatabaseModuleOptions = {
  auditedTables: Array<string>;
};

@Module({})
export class AuditLogDatabaseModule {
  static forRoot(config: AuditDatabaseModuleOptions): DynamicModule {
    return {
      module: AuditLogDatabaseModule,
      imports: [],
      providers: [
        AuditLogDatabaseService,
        {
          provide: 'AUDITEDTABLES',
          useValue: config.auditedTables,
        },
      ],
    };
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditLogUserSessionMiddleware).forRoutes('*');
  }
}

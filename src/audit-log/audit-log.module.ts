import { Module, DynamicModule } from '@nestjs/common';
import { AuditLogRequestModule } from './audit-log-request/audit-log-request.module';
import { AuditLogDatabaseModule } from './audit-log-database/audit-log-database.module';
import { AuditLogErrorModule } from './audit-log-error/audit-log-error.module';

import { AuditLogModelModule } from './audit-log-model/audit-log-model.module';
import { AuditLogEventModule } from './audit-log-event/audit-log-event.module';
import { AuditLogIntegrationModule } from './audit-log-integration/audit-log-integration.module';
import { AuditLogArchiveConfig, AuditLogArchiveModule } from './audit-log-archive/audit-log-archive.module';

type AuditLogModuleOptions = {
  enableErrorLogging?: boolean;
  enableRequestLogging?: boolean;
  enableIntegrationLogging?: boolean;
  auditedTables?: Array<string>;
  authRoute?: {
    path: string;
    methods: Array<string>;
  };
  enableArchive?: false | AuditLogArchiveConfig;
};

@Module({})
export class AuditLogModule {
  static forRoot(config: AuditLogModuleOptions): DynamicModule {
    const imports = [];
    const exports = [];
    const auditedTables = config.auditedTables ?? [];

    if (config.enableArchive) {
      imports.push(AuditLogArchiveModule.forRoot(config.enableArchive));
    }

    if (auditedTables.length > 0) {
      imports.push(
        AuditLogDatabaseModule.forRoot({
          auditedTables,
        }),
      );
    }

    if (config.enableErrorLogging) {
      imports.push(AuditLogErrorModule.forRoot({ modelModule: AuditLogModelModule }));
    }

    if (config.enableIntegrationLogging) {
      imports.push(
        AuditLogIntegrationModule.forRoot({ modelModule: AuditLogModelModule })
      );

      exports.push(AuditLogIntegrationModule);
    }

    if (config.enableRequestLogging) {
      imports.push(
        AuditLogRequestModule.forRoot({
          methods: config.authRoute?.methods,
          path: config.authRoute?.path,
        }),
      );
    }

    return {
      module: AuditLogModule,
      imports: [
        AuditLogEventModule.forRoot({ modelModule: AuditLogModelModule }),
        ...imports
      ],
      exports: [AuditLogEventModule, ...exports],
      providers: [],
    };
  }
}


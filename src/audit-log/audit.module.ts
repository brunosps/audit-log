import { Module, DynamicModule } from '@nestjs/common';
import { AuditRequestModule } from './audit-request.module';
import { AuditDatabaseModule } from './audit-database.module';
import { AuditErrorModule } from './audit-error.module';
import { AuditService } from './audit.service';
import { AuditModelModule } from './model/model.module';


type AuditLogModuleOptions = {
  enableErrorLogging?: boolean;
  enableRequestLogging?: boolean;
  auditedTables?: Array<string>
  authRoute?: {
    path: string;
    methods: Array<string>;
  }
}

@Module({})
export class AuditModule {
  static forRoot(config: AuditLogModuleOptions): DynamicModule {
    const imports = [];
    const enableErrorLogging = config.enableErrorLogging ?? false;
    const enableRequestLogging = config.enableRequestLogging ?? false;
    const auditedTables = config.auditedTables ?? [];

    if (enableErrorLogging) {
      imports.push(AuditErrorModule);
    }

    if (enableRequestLogging) {
      imports.push(AuditRequestModule.forRoot(
        {
          methods: config.authRoute?.methods,
          path: config.authRoute?.path
        }
      ));
    }

    if (auditedTables.length > 0) {
      imports.push(AuditDatabaseModule);
    }

    return {
      module: AuditModule,
      imports: [AuditModelModule, ...imports],
      exports: [AuditModelModule, AuditService],
      providers: [
        AuditService,
        {
          provide: 'AUDITEDTABLES',
          useValue: auditedTables
        },
      ],
    };
  }
}

// src/app.module.ts
import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { AuditLogHttpService } from './services/audit-log-http.service';
import { AuditLogSoapClientService } from './services/audit-log-soap-client.service';

type AuditLogIntegrationModuleOptions = {
    modelModule: any;
};

@Module({})
export class AuditLogIntegrationModule {
    static forRoot(config: AuditLogIntegrationModuleOptions): DynamicModule {
        return {
            module: AuditLogIntegrationModule,
            imports: [HttpModule, config.modelModule],
            exports: [AuditLogSoapClientService],
            providers: [AuditLogHttpService, AuditLogSoapClientService],
        };
    }
}

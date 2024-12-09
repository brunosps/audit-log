import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuditService } from './audit.service';

import { ErrorLoggingFilter } from './filters/error-logging.filter';
import { AuditModelModule } from './model/model.module';



@Module({
    imports: [AuditModelModule],
    providers: [
        {
            provide: APP_FILTER,
            useClass: ErrorLoggingFilter,
        },],
})
export class AuditErrorModule { }

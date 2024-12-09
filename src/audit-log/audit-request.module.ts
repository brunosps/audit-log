import { DynamicModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { AuditModelModule } from './model/model.module';
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware';

export type AuditRequestModuleOptions = {
    path: string;
    methods: Array<string>;
}

@Module({})
export class AuditRequestModule {
    static forRoot(config: AuditRequestModuleOptions): DynamicModule {
        return {
            module: AuditRequestModule,
            imports: [AuditModelModule],
            providers: [
                {
                    provide: 'AUTH_ROUTE',
                    useValue: config
                },
            ],
        };
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RequestLoggingMiddleware)
            .forRoutes('*');
    }
}

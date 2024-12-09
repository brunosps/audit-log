import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserSessionMiddleware } from './middleware/user-session.middleware';

@Module({
    imports: [],
})
export class AuditDatabaseModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(UserSessionMiddleware)
            .forRoutes('*');
    }
}

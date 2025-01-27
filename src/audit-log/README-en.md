# Audit Log Library for NestJS with Sequelize

This library provides a comprehensive audit logging system for NestJS applications using Sequelize as the ORM. It offers various features to log different types of events and actions within your application.

## Features

1. Database change logging
2. HTTP request logging
3. Error logging
4. Integration call logging (REST and SOAP)
5. Custom event logging
6. Log archiving

## Installation

To use this library in your NestJS project, you need to install it along with its dependencies:

```bash
npm install @your-org/audit-log-lib @nestjs/sequelize sequelize sequelize-typescript
```

## Configuration

To set up the Audit Log system in your NestJS application, you need to import and configure the `AuditLogModule` in your `AppModule`:

```typescript
import { Module } from '@nestjs/common';
import { AuditLogModule } from '@your-org/audit-log-lib';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      // Your database configuration
    }),
    AuditLogModule.forRoot({
      auditedTables: ['users', 'products'], // Tables to be audited
      enableErrorLogging: true,
      enableRequestLogging: true,
      enableIntegrationLogging: true,
      authRoute: {
        path: '/users',
        methods: ['POST'],
      },
      enableArchive: {
        retentionPeriod: 30, // Keep logs for 30 days before archiving
        archiveDatabase: {
          dialect: 'postgres',
          host: process.env.ARCHIVE_DB_HOST,
          port: parseInt(process.env.ARCHIVE_DB_PORT),
          username: process.env.ARCHIVE_DB_USERNAME,
          password: process.env.ARCHIVE_DB_PASSWORD,
          synchronize: true,
        },
        batchSize: 1000, // Process 1000 records at a time
      }
    }),
  ],
})
export class AppModule {}
```

## Usage

### Database Change Logging

Database change logging is automatically enabled for the tables specified in the `auditedTables` configuration. No additional code is required in your services or controllers.

### HTTP Request Logging

HTTP request logging is automatically enabled when `enableRequestLogging` is set to `true`. It will log all incoming HTTP requests.

### Error Logging

Error logging is automatically enabled when `enableErrorLogging` is set to `true`. It will catch and log all unhandled exceptions in your application.

### Integration Call Logging

Integration call logging is enabled when `enableIntegrationLogging` is set to `true`. It automatically logs REST API calls made using the built-in `HttpService`. For SOAP calls, you need to use the provided `AuditLogSoapClientService`:

```typescript
import { Injectable } from '@nestjs/common';
import { AuditLogSoapClientService } from '@your-org/audit-log-lib';

@Injectable()
export class YourService {
  constructor(private soapClient: AuditLogSoapClientService) {}

  async callSoapService() {
    const client = await this.soapClient.createClient('http://example.com/soap?wsdl', 'ExampleIntegration');
    // Use the client to make SOAP calls
  }
}
```

### Custom Event Logging

You can log custom events using the `AuditLogEvent` decorator:

```typescript
import { Injectable } from '@nestjs/common';
import { AuditLogEvent } from '@your-org/audit-log-lib';

@Injectable()
export class YourService {
  @AuditLogEvent({
    eventType: 'USER_ACTION',
    eventDescription: 'User performed a specific action',
    getDetails: (args, result) => ({ userId: args[0], action: 'specific_action', result })
  })
  async performUserAction(userId: string) {
    // Your logic here
  }
}
```

### Log Archiving

Log archiving is automatically handled if `enableArchive` is configured. It will run daily at 1 AM to archive logs older than the specified retention period.

## Models

The library creates the following database models for storing audit logs:

- `AuditLogModel`: Main log entry
- `AuditLogEntityModel`: Database entity changes
- `AuditLogRequestModel`: HTTP requests
- `AuditLogErrorModel`: Application errors
- `AuditLogEventModel`: Custom events
- `AuditLogIntegrationModel`: Integration calls

## Conclusion

This Audit Log library provides a comprehensive solution for logging various events in your NestJS application. By following the configuration and usage instructions above, you can easily integrate it into your project and gain valuable insights into your application's behavior and user actions.

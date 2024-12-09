import { Inject, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import { Sequelize } from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import { AuditDatabaseService } from "./audit-database.service";
import { AuditLogError } from "./model/audit-log-error.model";

import { AuditLogEvent } from "./model/audit-log-event.model";
import { AuditLog } from "./model/audit-log.model";


class EventDetails {
    userId?: string;
    ip?: string;
    details: Record<string, any>
}

@Injectable()
export class AuditService {
    private auditDatabaseService: AuditDatabaseService;

    async onModuleInit() {
        this.auditedTables.forEach(async (table) => {
            try {
                await this.auditDatabaseService.enable(table)
            } catch (error) {
                console.log("\n\nAuditService ERROR")
                console.log(error)
                console.log("\n\n")
            }
        })
    }

    constructor(
        @InjectConnection()
        private sequelizeInstance: Sequelize,

        @Inject('AUDITEDTABLES')
        private auditedTables: Array<string>,

        @InjectModel(AuditLog)
        private readonly auditLogModel: typeof AuditLog,

        @InjectModel(AuditLogEvent)
        private readonly auditLogEventModel: typeof AuditLogEvent,

        @InjectModel(AuditLogError)
        private readonly auditLogErrorModel: typeof AuditLogError,

    ) {
        this.auditDatabaseService = new AuditDatabaseService(this.sequelizeInstance)
        if (this.auditedTables.length > 0) {
            this.auditDatabaseService.createBaseTriggers();
        } else {
            this.auditDatabaseService.disableAll();
        }
    }

    async logEvent(eventType: string, eventDescription: string, eventDetails?: EventDetails): Promise<AuditLogEvent> {
        try {
            const auditLog = await this.auditLogModel.create({
                id: uuidv4(),
                logType: 'EVENT',
                ipAddress: eventDetails?.ip ?? '0.0.0.0',
                userId: eventDetails?.userId ?? '_',
                createdAt: new Date(),
            });

            const eventLog = await this.auditLogEventModel.create({
                id: uuidv4(),
                logId: auditLog.id,
                eventType,
                eventDescription,
                eventDetails: JSON.stringify(eventDetails?.details ?? {}),
            });

            return eventLog;
        } catch (error) {
            console.error('Error logging event:', error);
            throw new Error('Failed to log event');
        }
    }
}

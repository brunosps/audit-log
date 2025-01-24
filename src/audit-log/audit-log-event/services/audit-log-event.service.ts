import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { AuditLogError } from '../../audit-log-model/audit-log-error.model';

import { AuditLogEvent } from '../../audit-log-model/audit-log-event.model';
import { AuditLog } from '../../audit-log-model/audit-log.model';

class EventLogDetails {
  userId?: string;
  ip?: string;
  details: Record<string, any>;
}

@Injectable()
export class AuditLogEventService {
  constructor(
    @InjectModel(AuditLog)
    private readonly auditLogModel: typeof AuditLog,

    @InjectModel(AuditLogEvent)
    private readonly auditLogEventModel: typeof AuditLogEvent,

  ) { }

  async logEvent(
    eventType: string,
    eventDescription: string,
    eventDetails?: EventLogDetails,
  ): Promise<AuditLogEvent> {
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

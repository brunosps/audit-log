import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';

import { AuditLogEventModel } from '../../audit-log-model/audit-log-event.model';
import { AuditLogModel } from '../../audit-log-model/audit-log.model';

type AuditLogEventLogType = {
  type: string
  description: string
  userId?: string
  userIp?: string
  details?: Record<string, any>
}

@Injectable()
export class AuditLogEventService {
  constructor(
    @InjectModel(AuditLogModel)
    private readonly auditLogModel: typeof AuditLogModel,

    @InjectModel(AuditLogEventModel)
    private readonly auditLogEventModel: typeof AuditLogEventModel,
  ) { }

  async logEvent({ type, description, userId, userIp, details }: AuditLogEventLogType): Promise<AuditLogEventModel> {
    try {
      const auditLog = await this.auditLogModel.create({
        id: uuidv4(),
        logType: "EVENT",
        ipAddress: userIp ?? "0.0.0.0",
        userId: userId,
        createdAt: new Date(),
      })

      const eventLog = await this.auditLogEventModel.create({
        id: uuidv4(),
        logId: auditLog.id,
        eventType: type,
        eventDescription: description,
        eventDetails: JSON.stringify(details?.details ?? {}),
      })

      return eventLog
    } catch (error) {
      console.error("Error logging event:", error)
      throw new Error("Failed to log event")
    }
  }
}

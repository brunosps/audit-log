import { SetMetadata } from '@nestjs/common';

export const AUDIT_EVENT_KEY = 'audit_event';

export interface AuditLogEventOptions {
  eventType: string;
  eventDescription: string;
}

export const AuditLogEvent = (options: AuditLogEventOptions) => SetMetadata(AUDIT_EVENT_KEY, options);


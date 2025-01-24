import { SetMetadata } from "@nestjs/common"
import { AUDIT_LOG_SERVICE } from "../audit-log-event-constant"

export const AUDIT_EVENT_KEY = "audit_log_event"

export interface AuditLogEventOptions {
  eventType: string
  eventDescription: string
  getDetails?: (args: any[], result: any) => Record<string, any>
}

export function AuditLogEvent(options: AuditLogEventOptions) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(AUDIT_EVENT_KEY, options)(target, propertyKey, descriptor)

    const originalMethod = descriptor.value
    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args)

      const isController = Reflect.getMetadata("__isController__", target.constructor) !== undefined

      console.log("isController", isController);

      if (!isController) {
        try {
          const auditLogEventService = (global as any)[AUDIT_LOG_SERVICE]
          if (auditLogEventService) {
            const details = options.getDetails ? options.getDetails(args, result) : { params: args, result: result }

            await auditLogEventService.logEvent({
              type: options.eventType,
              description: options.eventDescription,
              userId: "_", // Você pode querer passar isso como um argumento se disponível
              userIp: "0.0.0.0", // Você pode querer passar isso como um argumento se disponível
              details: { details },
            })
          }
        } catch (error) {
          console.error("Failed to log audit event:", error)
        }
      }

      return result
    }

    return descriptor
  }
}
import { Injectable, Inject } from "@nestjs/common"
import type { Sequelize, Model, ModelCtor } from "sequelize-typescript"

import { Op } from "sequelize"
import { AuditLogArchiveConfig } from "../audit-log-archive.module";

@Injectable()
export class AuditLogArchiveService {
  private models: (typeof Model)[];
  private archiveModels: (typeof Model)[];

  constructor(
    @Inject('AUDIT_LOG_CONFIG')
    private readonly config: AuditLogArchiveConfig,
    @Inject('MAIN_SEQUELIZE')
    private readonly sequelize: Sequelize,
    @Inject('ARCHIVE_SEQUELIZE')
    private readonly archiveSequelize: Sequelize,
  ) {

    this.models = Object.entries(this.sequelize.models).map(arr => arr[1] as unknown as typeof Model)
    this.archiveModels = Object.entries(this.archiveSequelize.models).map(arr => arr[1] as unknown as typeof Model)
  }

  async execute(): Promise<void> {
    const tablesToArchive = [
      "audit_logs",
      "audit_logs_entity",
      "audit_logs_error",
      "audit_logs_request",
      "audit_logs_event",
      "audit_logs_integration",
    ]
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionPeriod)

    for (const table of tablesToArchive) {
      const model = this.getModelByTableName(this.models, table)
      await this.archiveModelData(model, cutoffDate)
    }
  }

  private getModelByTableName(models: (typeof Model)[], tableName: string) {
    const model = models.find((model) => model.tableName.toUpperCase() === tableName.toUpperCase())

    if (!model) {
      throw new Error(`Model not found for table: ${tableName}`)
    }

    return model
  }

  private async archiveModelData(model: typeof Model, cutoffDate: Date): Promise<void> {
    const tableName = model.tableName
    const primaryKey = model.primaryKeyAttribute

    let offset = 0
    let totalArchived = 0

    while (true) {
      const logsToArchive = await (model as ModelCtor<Model>).findAll({
        where: {
          createdAt: {
            [Op.lt]: cutoffDate,
          },
        },
        limit: this.config.batchSize || 1000,
        offset,
        order: [["createdAt", "ASC"]],
        raw: true,
      })

      if (logsToArchive.length === 0) {
        break
      }

      await this.sequelize.transaction(async (transaction) => {
        await this.archiveSequelize.transaction(async (archiveTransaction) => {
          const archiveModel = this.getModelByTableName(this.archiveModels, tableName)

          console.log(logsToArchive);


          await (archiveModel as ModelCtor<Model>).bulkCreate(logsToArchive.map(log => {
            return { ...log }
          }), {
            transaction: archiveTransaction,
          });


          const idsToDelete = logsToArchive.map((log) => log[primaryKey])
          await (model as ModelCtor<Model>).destroy({
            where: {
              [primaryKey]: idsToDelete,
            },
            transaction,
          })

        })
      })

      totalArchived += logsToArchive.length
      offset += logsToArchive.length

      console.log(`Archived ${totalArchived} logs from table: ${tableName}`)
    }

    console.log(`Completed archiving for table ${tableName}. Total archived: ${totalArchived} `)
  }
}


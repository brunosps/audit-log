// src/providers/http-logging.provider.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { InjectModel } from '@nestjs/sequelize';
import { v4 as uuidv4 } from 'uuid';
import { AuditLog } from '../../audit-log-model/audit-log.model';
import { AuditLogIntegration } from '../../audit-log-model/audit-log-integration.model';

interface AxiosRequestConfigWithMetadata extends AxiosRequestConfig {
  metadata?: { startTime: number };
}

@Injectable()
export class AuditLogHttpService implements OnModuleInit {
  private readonly logger = new Logger(AuditLogHttpService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(AuditLog) private readonly auditLogModel: typeof AuditLog,
    @InjectModel(AuditLogIntegration)
    private readonly auditLogIntegrationModel: typeof AuditLogIntegration,
  ) { }

  onModuleInit() {
    const axiosInstance = this.httpService.axiosRef;

    axiosInstance.interceptors.request.use(async (config: AxiosRequestConfigWithMetadata) => {
      config.metadata = { startTime: Date.now() }; // Adiciona o tempo inicial para medir a duração
      return config;
    });

    axiosInstance.interceptors.response.use(
      async (response: AxiosResponse) => {
        const { config } = response;

        const duration = Date.now() - ((config as AxiosRequestConfigWithMetadata).metadata?.startTime || Date.now());

        await this.saveLog({
          integrationName: config.url ?? 'unknown', // Use a URL como "nome da integração"
          method: config.method?.toUpperCase() ?? 'UNKNOWN',
          requestPayload: JSON.stringify(config.data || {}),
          responsePayload: JSON.stringify(response.data || {}),
          status: response.status.toString(),
          duration,
        });

        return response;
      },
      async (error) => {
        const { config } = error;

        const duration = Date.now() - (config.metadata?.startTime || Date.now());

        await this.saveLog({
          integrationName: config.url ?? 'unknown',
          method: config.method?.toUpperCase() ?? 'UNKNOWN',
          requestPayload: JSON.stringify(config.data || {}),
          responsePayload: JSON.stringify(error.response?.data || {}),
          status: error.response?.status?.toString() ?? 'ERROR',
          duration,
        });

        throw error;
      },
    );
  }

  private async saveLog({
    integrationName,
    method,
    requestPayload,
    responsePayload,
    status,
    duration,
  }: {
    integrationName: string;
    method: string;
    requestPayload: string;
    responsePayload: string;
    status: string;
    duration: number;
  }) {
    try {
      const auditLog = await this.auditLogModel.create({
        id: uuidv4(),
        logType: 'INTEGRATION',
        ipAddress: '9.9.9.9',
        userId: 'TESTE',
        createdAt: new Date(),
      });

      await this.auditLogIntegrationModel.create({
        id: uuidv4(),
        logId: auditLog.id,
        integrationName,
        method,
        requestPayload,
        responsePayload,
        status,
        duration,
      });
    } catch (error) {
      console.error('Error saving error log:', error);
    }
  }
}

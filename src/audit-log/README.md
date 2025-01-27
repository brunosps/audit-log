# Biblioteca de Log de Auditoria para NestJS com Sequelize

Esta biblioteca fornece um sistema abrangente de log de auditoria para aplicações NestJS usando Sequelize como ORM. Ela oferece várias funcionalidades para registrar diferentes tipos de eventos e ações dentro da sua aplicação.

## Funcionalidades

1. Registro de alterações no banco de dados
2. Registro de requisições HTTP
3. Registro de erros
4. Registro de chamadas de integração (REST e SOAP)
5. Registro de eventos personalizados
6. Arquivamento de logs

## Instalação

Para usar esta biblioteca em seu projeto NestJS, você precisa instalá-la junto com suas dependências:

```bash
npm install @sua-org/audit-log-lib @nestjs/sequelize sequelize sequelize-typescript
```

## Configuração

Para configurar o sistema de Log de Auditoria em sua aplicação NestJS, você precisa importar e configurar o `AuditLogModule` em seu `AppModule`:

```typescript
import { Module } from '@nestjs/common';
import { AuditLogModule } from '@sua-org/audit-log-lib';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      // Sua configuração de banco de dados
    }),
    AuditLogModule.forRoot({
      auditedTables: ['usuarios', 'produtos'], // Tabelas a serem auditadas
      enableErrorLogging: true,
      enableRequestLogging: true,
      enableIntegrationLogging: true,
      authRoute: {
        path: '/usuarios',
        methods: ['POST'],
      },
      enableArchive: {
        retentionPeriod: 30, // Manter logs por 30 dias antes de arquivar
        archiveDatabase: {
          dialect: 'postgres',
          host: process.env.ARCHIVE_DB_HOST,
          port: parseInt(process.env.ARCHIVE_DB_PORT),
          username: process.env.ARCHIVE_DB_USERNAME,
          password: process.env.ARCHIVE_DB_PASSWORD,
          synchronize: true,
        },
        batchSize: 1000, // Processar 1000 registros por vez
      }
    }),
  ],
})
export class AppModule {}
```

## Uso

### Registro de Alterações no Banco de Dados

O registro de alterações no banco de dados é automaticamente habilitado para as tabelas especificadas na configuração `auditedTables`. Nenhum código adicional é necessário em seus serviços ou controladores.

### Registro de Requisições HTTP

O registro de requisições HTTP é automaticamente habilitado quando `enableRequestLogging` é definido como `true`. Ele registrará todas as requisições HTTP recebidas.

### Registro de Erros

O registro de erros é automaticamente habilitado quando `enableErrorLogging` é definido como `true`. Ele capturará e registrará todas as exceções não tratadas em sua aplicação.

### Registro de Chamadas de Integração

O registro de chamadas de integração é habilitado quando `enableIntegrationLogging` é definido como `true`. Ele registra automaticamente as chamadas de API REST feitas usando o `HttpService` integrado. Para chamadas SOAP, você precisa usar o `AuditLogSoapClientService` fornecido:

```typescript
import { Injectable } from '@nestjs/common';
import { AuditLogSoapClientService } from '@sua-org/audit-log-lib';

@Injectable()
export class SeuServico {
  constructor(private soapClient: AuditLogSoapClientService) {}

  async chamarServicoSoap() {
    const client = await this.soapClient.createClient('http://exemplo.com/soap?wsdl', 'IntegracaoExemplo');
    // Use o cliente para fazer chamadas SOAP
  }
}
```

### Registro de Eventos Personalizados

Você pode registrar eventos personalizados usando o decorador `AuditLogEvent`:

```typescript
import { Injectable } from '@nestjs/common';
import { AuditLogEvent } from '@sua-org/audit-log-lib';

@Injectable()
export class SeuServico {
  @AuditLogEvent({
    eventType: 'ACAO_USUARIO',
    eventDescription: 'Usuário realizou uma ação específica',
    getDetails: (args, result) => ({ userId: args[0], acao: 'acao_especifica', resultado: result })
  })
  async realizarAcaoUsuario(userId: string) {
    // Sua lógica aqui
  }
}
```

### Arquivamento de Logs

O arquivamento de logs é tratado automaticamente se `enableArchive` estiver configurado. Ele será executado diariamente à 1h da manhã para arquivar logs mais antigos que o período de retenção especificado.

## Modelos

A biblioteca cria os seguintes modelos de banco de dados para armazenar logs de auditoria:

- `AuditLogModel`: Entrada principal do log
- `AuditLogEntityModel`: Alterações nas entidades do banco de dados
- `AuditLogRequestModel`: Requisições HTTP
- `AuditLogErrorModel`: Erros da aplicação
- `AuditLogEventModel`: Eventos personalizados
- `AuditLogIntegrationModel`: Chamadas de integração

## Conclusão

Esta biblioteca de Log de Auditoria fornece uma solução abrangente para registrar vários eventos em sua aplicação NestJS. Seguindo as instruções de configuração e uso acima, você pode facilmente integrá-la ao seu projeto e obter insights valiosos sobre o comportamento da sua aplicação e as ações dos usuários.

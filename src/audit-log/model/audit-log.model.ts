import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  CreatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'audit_logs',
  timestamps: false,
})
export class AuditLog extends Model<AuditLog> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    allowNull: false,
    field: 'id',
  })
  id!: string;

  @Column({
    type: DataType.ENUM('ENTITY', 'REQUEST', 'ERROR', 'EVENT', 'LOGIN'),
    allowNull: false,
    field: 'log_type',
  })
  logType!: 'ENTITY' | 'REQUEST' | 'ERROR' | 'EVENT' | 'LOGIN';

  @Default('0.0.0.0')
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'ip_address',
  })
  ipAddress!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'user_id',
  })
  userId!: string;

  @CreatedAt
  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'created_at',
  })
  createdAt!: Date;
}

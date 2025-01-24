import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
} from 'sequelize-typescript';

@Table({
  tableName: 'minha_tabela',
  timestamps: false,
})
export class MinhaTabela extends Model<MinhaTabela> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  com_id: number;

  @Column({
    type: DataType.BIGINT.UNSIGNED,
    allowNull: true,
  })
  com_id_lote: number;

  // @Default(Buffer.from([1])) // Usamos um buffer para definir o valor padrão de binário
  // @Column({
  //     type: DataType.BLOB, // BLOB representa dados binários
  //     allowNull: false,
  // })
  // lin_status: Buffer;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  pes_migrado: boolean;

  @Column({
    type: DataType.CHAR(14),
    allowNull: true,
  })
  vou_cpf: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  data: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dataInicio: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dataFim: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  primeiraParcela: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  ultimaParcela: number;

  @Column({
    type: DataType.ENUM('CONSORCIO', 'SEGURO'),
    allowNull: false,
  })
  tipo: 'CONSORCIO' | 'SEGURO';

  @Column({
    type: DataType.ENUM('ATIVO', 'INATIVO'),
    allowNull: false,
  })
  status: 'ATIVO' | 'INATIVO';

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  codigoUnidadeNegocio: number;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: true,
  })
  contrato_informacoes: string;

  @Column({
    type: DataType.TEXT('medium'),
    allowNull: true,
  })
  dados_anexo: string;

  @Default(1)
  @Column({
    type: DataType.SMALLINT,
    allowNull: false,
  })
  men_status: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  payload: string;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  log_data_adicionado: Date;

  @Default(DataType.NOW)
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  men_data_adicionado: Date;

  @Default(0)
  @Column({
    type: DataType.TINYINT,
    allowNull: false,
  })
  sincronizado: number;

  @Column({
    type: DataType.STRING(1000),
    allowNull: false,
  })
  nome: string;
}

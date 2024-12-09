import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Entity extends Model<Entity> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}

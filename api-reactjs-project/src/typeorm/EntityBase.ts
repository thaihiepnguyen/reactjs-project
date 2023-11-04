import {Column, PrimaryGeneratedColumn} from "typeorm";

export abstract class EntityBase {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "id"
  })
  id: number;

  @Column("tinyint", {
    name: "is_valid",
    default: () => "'0'",
  })
  isValid: boolean

  @Column('timestamp', {
    name: 'created_at',
    comment: '作成日時',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date

  @Column('timestamp', {
    name: 'updated_at',
    comment: '更新日時',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date
}
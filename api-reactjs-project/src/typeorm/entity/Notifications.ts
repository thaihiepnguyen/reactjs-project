import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import { EntityBase } from "../EntityBase";

@Entity('notifications', {schema: 'QLHSSV_DB'})
export class Notifications extends EntityBase {
  @Column("tinyint", {
    name: "is_valid",
    default: () => "'0'",
  })
  isValid: boolean

  @Column("varchar", {
    length: 255,
    name: "title"
  })
  title: string;

  @Column("text", {
    name: "content"
  })
  content: string;

  @Column({
    type: "int",
    name: "from"
  })
  from: number;

  @Column({
    type: "int",
    name: "to"
  })
  to: number;
}
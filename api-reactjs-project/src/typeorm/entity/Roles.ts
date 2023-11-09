import {Column, Entity} from "typeorm";
import {EntityBase} from "./EntityBase";

@Entity('roles', {schema: 'QLHSSV_DB'})
export class Roles extends EntityBase{
  @Column("varchar", {
    length: 255,
    name: "name"
  })
  name: string;
}
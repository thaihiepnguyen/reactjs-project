import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {EntityBase} from "./EntityBase";

@Entity('users', {schema: 'QLHSSV_DB'})
export class Users extends EntityBase{
  @Column("varchar", {
    length: 255,
    name: "username"
  })
  username: string;

  @Column("varchar", {
    length: 255,
    name: "password"
  })
  password: string;

  @Column("varchar", {
    length: 255,
    name: "email"
  })
  email: string;

  @Column("tinyint", {
    name: "is_admin",
    default: () => "'0'",
  })
  isAdmin: boolean

  @Column("tinyint", {
    name: "is_student",
    default: () => "'0'",
  })
  isStudent: boolean

  @Column("tinyint", {
    name: "is_teacher",
    default: () => "'0'",
  })
  isTeacher: boolean
}
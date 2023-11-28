import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {EntityBase} from "./EntityBase";

@Entity('users', {schema: 'QLHSSV_DB'})
export class Users extends EntityBase{
  @Column("tinyint", {
    name: "is_valid",
    default: () => "'0'",
  })
  isValid: boolean

  @Column("tinyint", {
    name: "is_active",
    default: () => "'0'",
  })
  isActive: boolean

  @Column("varchar", {
    length: 255,
    name: "studentId"
  })
  studentId: string;
  
  @Column("varchar", {
    length: 255,
    name: "fullname"
  })
  fullname: string;

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

  @Column("text", {
    name: "avatar_url"
  })
  avatarUrl: string;

  @Column("int", {
    name: "role_id",
    default: () => "'1'",
  })
  roleId: number;

  @Column("text", {
    name: "refresh_token",
  })
  refreshToken: string;

  @Column("text", {
    name: "phone"
  })
  phone: string;
}
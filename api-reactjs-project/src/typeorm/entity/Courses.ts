import {Column, Entity} from "typeorm";
import {EntityBase} from "../EntityBase";

@Entity('courses', {schema: 'QLHSSV_DB'})
export class Courses extends EntityBase{
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

  @Column("varchar", {
    length: 255,
    name: "description"
  })
  description: string;

  @Column("varchar", {
    length: 255,
    name: "teacher_ids"
  })
  teacherIds: string;

  @Column("varchar", {
    length: 255,
    name: "student_ids"
  })
  studentIds: string;
}
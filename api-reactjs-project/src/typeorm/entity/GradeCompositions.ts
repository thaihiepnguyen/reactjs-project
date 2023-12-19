import {Column, Entity} from "typeorm";
import { EntityBase } from "../EntityBase";

@Entity('grade_compositions', {schema: 'QLHSSV_DB'})
export class GradeCompositions extends EntityBase{
  @Column("int", {
    name: "course_id",
    default: () => "'0'",
  })
  courseId: number;

  @Column("varchar", {
    length: 255,
    name: "name"
  })
  name: string;

  @Column("int", {
    name: "scale",
    default: () => "'0'",
  })
  scale: number;

  @Column("int", {
    name: "order",
    default: () => "'0'",
  })
  order: number;

  @Column("tinyint", {
    name: "is_final",
    default: () => "'0'",
  })
  isFinal: boolean
}
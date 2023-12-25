import {Column, Entity, JoinColumn, OneToOne} from "typeorm";
import { EntityBase } from "../EntityBase";
import { GradeCompositions } from "./GradeCompositions";

@Entity('scores', {schema: 'QLHSSV_DB'})
export class Scores extends EntityBase{
  @Column("int", {
    name: "grade_id",
    default: () => "'0'",
  })
  gradeId: number;

  @Column("varchar", {
    length: 50,
    name: "student_id",
    default: () => "''",
  })
  studentId: string;

  @Column("int", {
    name: "teacher_id",
    default: () => "'0'",
  })
  teacherId: number;

  @Column("float", {
    name: "score",
    default: () => "'0'",
  })
  score: number;

  @OneToOne(() => GradeCompositions)
  @JoinColumn({name: 'grade_id'})
  grade: GradeCompositions
}
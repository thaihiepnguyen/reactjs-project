import { Column, Entity } from 'typeorm';
import { EntityBase } from '../EntityBase';

@Entity('participants', { schema: 'WEBNC_APP' })
export class Participants extends EntityBase {
  @Column('int', {
    name: 'course_id',
  })
  courseId: number;

  @Column('int', {
    name: 'student_id',
  })
  studentId: number;
}

import { Column, Entity } from 'typeorm';
import { EntityBase } from '../EntityBase';

@Entity('absent_participants', { schema: 'QLHSSV_DB' })
export class AbsentPariticipants extends EntityBase {
  @Column('int', {
    name: 'course_id',
  })
  courseId: number;

  @Column('int', {
    name: 'student_id',
  })
  studentId: string;
}

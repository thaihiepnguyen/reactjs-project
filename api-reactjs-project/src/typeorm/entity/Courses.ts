import { Column, Entity } from 'typeorm';
import { EntityBase } from '../EntityBase';

@Entity('courses', { schema: 'WEBNC_APP' })
export class Courses extends EntityBase {
  @Column('tinyint', {
    name: 'is_valid',
    default: () => "'0'",
  })
  isValid: boolean;

  @Column('tinyint', {
    name: 'is_active',
    default: () => "'0'",
  })
  isActive: boolean;

  @Column('varchar', {
    length: 255,
    name: 'title',
  })
  title: string;

  @Column('varchar', {
    length: 255,
    name: 'description',
  })
  description: string;

  @Column('varchar', {
    length: 255,
    name: 'teacher_ids',
  })
  teacherIds: string;

  @Column('varchar', {
    length: 255,
    name: 'class_code',
  })
  classCode: string;
}

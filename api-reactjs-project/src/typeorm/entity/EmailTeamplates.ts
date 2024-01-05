import { Column, Entity } from 'typeorm';
import { EntityBase } from '../EntityBase';

@Entity('email_teamplates', { schema: 'WEBNC_APP' })
export class EmailTemplates extends EntityBase {
  @Column('varchar', {
    length: 255,
    name: 'name',
  })
  name: string;

  @Column('varchar', {
    length: 255,
    name: 'content',
  })
  content: string;
}

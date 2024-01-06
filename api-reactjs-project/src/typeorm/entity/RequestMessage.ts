import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { EntityBase } from '../EntityBase';
import { RequestReview } from './RequestReview';

@Entity('request_message', { schema: 'WEBNC_APP' })
export class RequestMessage extends EntityBase {
  @Column('int', {
    name: 'request_id',
  })
  requestId: number;

  @Column('int', {
    name: 'from',
  })
  from: number;

  @Column('varchar', {
    length: 255,
    name: 'message',
  })
  message: string;

  @Column('int', {
    name: 'order',
  })
  order: number;

  @ManyToOne(() => RequestReview, (request) => request.messages)
  @JoinColumn({ name: 'request_id' })
  request: RequestReview;
}

import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { EntityBase } from '../EntityBase';
import { RequestMessage } from './RequestMessage';
import { Scores } from './Scores';

@Entity('request_review', { schema: 'QLHSSV_DB' })
export class RequestReview extends EntityBase {
  @Column('int', {
    name: 'score_id',
  })
  scoreId: number;

  @Column('tinyint', {
    name: 'isSeen',
    default: () => "'0'",
  })
  isSeen: boolean;

  @Column('tinyint', {
    name: 'accept_new_request',
    default: () => 0,
  })
  acceptNewRequest: boolean;

  @Column('tinyint', {
    name: 'isFinal',
    default: () => 0,
  })
  isFinal: boolean;

  @OneToMany(() => RequestMessage, (message) => message.request)
  messages: RequestMessage[];

  @OneToOne(() => Scores)
  @JoinColumn({ name: 'score_id' })
  score: Scores;
}

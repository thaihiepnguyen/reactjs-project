import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from "@nestjs/websockets";
import {Server} from 'socket.io'
import {OnModuleInit} from "@nestjs/common";
import {Observable} from "rxjs";
import {TMessageResponse} from "./gateway.typing";

export const MESSAGE_TYPE = {
  COURSES: 1,
  SCORES: 2,
  REQUEST_REVIEW: 3,
}
@WebSocketGateway({ cors: true })
export class GatewayService implements OnModuleInit {
  @WebSocketServer()
  private server: Server

  onModuleInit(): any {
    this.server.on('connection', (socket) => {
      console.log('Client: ' + socket.id + ' joined')
    })
  }
  @SubscribeMessage('subscribeCourses')
  onSubscribeCourses(
    @MessageBody() data: any,
    @ConnectedSocket() client: any,
  ): Observable<WsResponse<any>> | any{
    console.log(`userId: ${data.userId} joined as ${client.id}`)
    data.courses.forEach(item => {
      const room = 'room-' + item
      client.join(room)
      console.log(client.id + ' joined ' + room)
    })
    return
  }

  public pushNotification(rooms: string[] | string, payload: any, type: number = 1) {
    const message: TMessageResponse = {
      type: type,
      data: payload
    }
    this.server.in(rooms).emit('subscribeCourses', message)
  }
}
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
    console.log('Channel: subscribeCourses')
    data.courses.forEach(item => {
      const room = 'room-' + item
      client.join(room)
      console.log(client.id + ' joined ' + room)
    })
    return
  }

  public pushNotification(rooms: string[] | string, payload: any) {
    this.server.in(rooms).emit('subscribeCourses', payload)
  }
}
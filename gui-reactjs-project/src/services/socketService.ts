import io, {Socket} from "socket.io-client"

export const coursesEvent = 'subscribeCourses'
export const MESSAGE_TYPE = {
  COURSES: 1,
  SCORES: 2,
  REQUEST_REVIEW: 3,
  ACCEPT_REQUEST_REVIEW: 4,
  NOTIFICATION_REQUEST_REVIEW: 5,
}
export default class SocketService {
  private static _instance: SocketService
  private _socket: Socket

  private constructor() {
    this._socket = io(process.env.API_URL, {
      transports: ['websocket'],
    }).connect()
  }

  public static instance() {
    if (!SocketService._instance) {
      SocketService._instance = new SocketService()
    }
    return SocketService._instance
  }

  public subscribeCourses(courseIds: number[], userId: number) {
    this._socket.emit(coursesEvent, {
      courses: courseIds,
      userId: userId
    })
  }

  public listenCourses(callback) {
    this._socket.on(coursesEvent, (data) => {
      callback(data)
    })
  }

  public close() {
    this._socket.close()
  }
}
import {Injectable} from "@nestjs/common";
import {GatewayService} from "../gateway/gateway.service";
import {CourseService} from "../course/course.service";
import {UserService} from "../user/user.service";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection, In} from "typeorm";
import {Notifications} from "../../typeorm/entity/Notifications";
import {TBaseDto} from "../../app.dto";
import {Users} from "../../typeorm/entity/Users";

@Injectable()
export class NotificationService {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly courseService: CourseService,
    private readonly userService: UserService,
    @InjectConnection()
    private readonly connection: Connection
  ) {}
  async pushAllCourses(teacherId: number, title: string, message: string) {
    const courses = await this.courseService.getMyCourses(teacherId);
    const teacher = await this.userService.findUserById(teacherId)

    const courseIds = courses.map(item => (item.id))
    if (!courseIds.length) return

    const sql =
      `
      SELECT
        p.student_id as studentId,
        u.fullname
      FROM participants as p
      LEFT JOIN users as u ON p.student_id = u.id
      WHERE p.course_id IN (?) and u.is_valid = 1
      GROUP BY p.student_id;
      `

    const rawData = await this.connection.query(sql, [courseIds])

    const rooms = courseIds.map(item => (`room-${item}`));

    const notiValues = rawData.map(item => {
      return {
        title: title,
        content: `Chào ${item.fullname}, \n${message} \nTrân trọng, \n${teacher.fullname}`,
        from: teacher.id,
        to: item.studentId
      }
    })
    await this.connection.getRepository(Notifications)
      .createQueryBuilder()
      .insert()
      .values(notiValues)
      .execute()

    const payload = {
      avatarUrl: teacher.avatarUrl,
      userName: teacher.fullname,
      message: message,
      title: title,
      time: 0,
    }
    this.gatewayService.pushNotification(rooms, payload)
  }

  async getNotifications(userId: number): Promise<TBaseDto<any>>{
    const notis = await this.connection.getRepository(Notifications)
      .find({
        where: {
          to: userId
        }
      });

    const fromIds = notis.reduce((acc, cur) => {
      if (!acc.includes(cur.from)) {
        acc.push(cur.from);
      }
      return acc;
    }, []);

    const froms = await this.connection.getRepository(Users)
      .find({
        where: {
          id: In(fromIds)
        }
      });

    const index = froms.reduce((acc, cur) => {
      acc[cur.id] = cur
      return acc
    }, {})
    return {
      message: 'success',
      data: notis.map(item => ({
        avatarUrl: index[item.from].avatarUrl,
        userName: index[item.from].fullname,
        message: item.content,
        title: item.title,
        time: 1,
      })),
      statusCode: 200
    }
  }

  // Lệch múi giờ cmnr :))))
  private _getMinutes(from: Date, to: Date) {
    return Math.abs((to.getTime() - from.getTime()) / 1000 / 60);
  }

  async pushCourses(id: number, teacherId: number, message: string, title: string) {
    const teacher = await this.userService.findUserById(teacherId)
    const sql =
      `
      SELECT
        p.student_id as studentId,
        u.fullname,
        c.title
      FROM participants as p
      LEFT JOIN users as u ON p.student_id = u.id
      LEFT JOIN courses as c ON p.course_id = c.id
      WHERE p.course_id = ? and u.is_valid = 1 and c.is_valid = 1
      GROUP BY p.student_id;
      `
    const rawData = await this.connection.query(sql, [id])
    const room = `room-${id}`

    const notiValues = rawData.map(item => {
      return {
        title: title,
        content: `<h5>Thông báo từ lớp học ${item.title} </h5> <p>${message}</p> <h5>Trân trọng, </h5> <h5>${teacher.fullname}</h5>`,
        from: teacher.id,
        to: item.studentId
      }
    })
    await this.connection.getRepository(Notifications)
      .createQueryBuilder()
      .insert()
      .values(notiValues)
      .execute()

    const payload = {
      avatarUrl: teacher.avatarUrl,
      userName: teacher.fullname,
      message: `<h5>Thông báo từ lớp học ${rawData[0].title} </h5> <p>${message}</p> <h5>Trân trọng, </h5> <h5>${teacher.fullname}</h5>`,
      title: title,
      time: 0,
    }
    this.gatewayService.pushNotification(room, payload)
  }
}
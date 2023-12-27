import {Injectable} from "@nestjs/common";
import {GatewayService, MESSAGE_TYPE} from "../gateway/gateway.service";
import {CourseService} from "../course/course.service";
import {UserService} from "../user/user.service";
import {InjectConnection} from "@nestjs/typeorm";
import {Connection, In} from "typeorm";
import {Notifications} from "../../typeorm/entity/Notifications";
import {TBaseDto} from "../../app.dto";
import {Users} from "../../typeorm/entity/Users";
import * as moment from "moment";

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
        },
        order: {
          createdAt: "DESC"
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
        time: this._getMinutes(item.createdAt),
      })),
      statusCode: 200
    }
  }

  // Lệch múi giờ cmnr :))))
  private _getMinutes(from) {
    const sentTime = moment(from).add(7, "hours")
    const now = moment();
    return now.diff(sentTime, 'minutes');
  }
  /*
   * Push a message to students that are in this course
   *
   * @param id is a course id
   * @param teacherId
   * @param message
   * @param title
   *
   * Return null
   */
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
    this.gatewayService.pushNotification(room, payload, MESSAGE_TYPE.COURSES)
  }


  async pushScores(
    id: number,
    gradeIds: number[],
    title: string
  ) {
    if (!gradeIds || !gradeIds.length) {
      return
    }
    const sql = `
    SELECT
      c.title as courseName,
      u1.id as studentId,
      u2.id as teacherId,
      u1.fullname as studentName,
      u2.fullname as teacherName,
      s.score as score,
      u2.avatar_url as teacherAvatar,
      gc.name as gradeName
    FROM grade_compositions gc, scores s, courses c, users u1, users u2
    WHERE gc.id = s.grade_id
    AND c.id = gc.course_id
    AND u1.student_id = s.student_id
    AND u2.id = s.teacher_id
    AND gc.id IN (?);
    `;
    const rawData = await this.connection.query(sql, [gradeIds]);
    const room = `room-${id}`;

    const notiValues = rawData.map(item => {
      const message = `Điểm ${item.gradeName} của bạn là: ${item.score}`;
      return {
        title: title,
        content: `<h5>Thông báo từ lớp học ${item.courseName} </h5> <p>${message}</p> <h5>Trân trọng, </h5> <h5>${item.teacherName}</h5>`,
        from: item.teacherId,
        to: item.studentId
      }
    });
    await this.connection.getRepository(Notifications)
      .createQueryBuilder()
      .insert()
      .values(notiValues)
      .execute();

    const payload = rawData.reduce((acc, cur) => {
      const message = `Điểm ${cur.gradeName} của bạn là: ${cur.score} điểm`;
      const item = {
        avatarUrl: cur.teacherAvatar,
        userName: cur.teacherName,
        message: `<h5>Thông báo từ lớp học ${cur.courseName} </h5> <p>${message}</p> <h5>Trân trọng, </h5> <h5>${cur.teacherName}</h5>`,
        title: title,
        time: 0,
      }
      if (!acc[cur.studentId]) {
        acc[cur.studentId] = [item];
      } else {
        acc[cur.studentId].push(item);
      }
      return acc;
    }, {});

    this.gatewayService.pushNotification(room, payload, MESSAGE_TYPE.SCORES);
  }
}
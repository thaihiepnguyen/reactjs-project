import { Injectable } from '@nestjs/common';
import { GatewayService, MESSAGE_TYPE } from '../gateway/gateway.service';
import { CourseService } from '../course/course.service';
import { UserService } from '../user/user.service';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, In } from 'typeorm';
import { Notifications } from '../../typeorm/entity/Notifications';
import { TBaseDto } from '../../app.dto';
import { Users } from '../../typeorm/entity/Users';
import * as moment from 'moment';
import { RequestReview } from '../../typeorm/entity/RequestReview';

@Injectable()
export class NotificationService {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly courseService: CourseService,
    private readonly userService: UserService,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}
  async pushAllCourses(teacherId: number, title: string, message: string) {
    const courses = await this.courseService.getMyCourses(teacherId);
    const teacher = await this.userService.findUserById(teacherId);

    const courseIds = courses.map((item) => item.id);
    if (!courseIds.length) return;

    const sql = `
      SELECT
        p.student_id as studentId,
        u.fullname
      FROM participants as p
      LEFT JOIN users as u ON p.student_id = u.id
      WHERE p.course_id IN (?) and u.is_valid = 1
      GROUP BY p.student_id;
      `;

    const rawData = await this.connection.query(sql, [courseIds]);

    const rooms = courseIds.map((item) => `room-${item}`);

    const notiValues = rawData.map((item) => {
      return {
        title: title,
        content: `Chào ${item.fullname}, \n${message} \nTrân trọng, \n${teacher.fullname}`,
        from: teacher.id,
        to: item.studentId,
      };
    });
    await this.connection
      .getRepository(Notifications)
      .createQueryBuilder()
      .insert()
      .values(notiValues)
      .execute();

    const payload = {
      avatarUrl: teacher.avatarUrl,
      userName: teacher.fullname,
      message: message,
      title: title,
      time: `a new message`,
    };
    this.gatewayService.pushNotification(rooms, payload);
  }

  async getNotifications(userId: number): Promise<TBaseDto<any>> {
    const notis = await this.connection.getRepository(Notifications).find({
      where: {
        to: userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const fromIds = notis.reduce((acc, cur) => {
      if (!acc.includes(cur.from)) {
        acc.push(cur.from);
      }
      return acc;
    }, []);

    const froms = await this.connection.getRepository(Users).find({
      where: {
        id: In(fromIds),
      },
    });

    const index = froms.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});
    return {
      message: 'success',
      data: notis.map((item) => ({
        avatarUrl: index[item.from].avatarUrl,
        userName: index[item.from].fullname,
        message: item.content,
        title: item.title,
        time: this._getMinutes(item.createdAt),
      })),
      statusCode: 200,
    };
  }

  private _getMinutes(from) {
    const sentTime = moment(from);
    const now = moment();
    const diffMinutes = now.diff(sentTime, 'minutes');
    if (diffMinutes <= 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffMinutes <= 1440) {
      return `${now.diff(sentTime, 'hours')} hours ago`;
    } else {
      return `${now.diff(sentTime, 'days')} days ago`;
    }
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
  async pushCourses(
    id: number,
    teacherId: number,
    message: string,
    title: string,
  ) {
    const teacher = await this.userService.findUserById(teacherId);
    const sql = `
      SELECT
        p.student_id as studentId,
        u.fullname,
        c.title
      FROM participants as p
      LEFT JOIN users as u ON p.student_id = u.id
      LEFT JOIN courses as c ON p.course_id = c.id
      WHERE p.course_id = ? and u.is_valid = 1 and c.is_valid = 1
      GROUP BY p.student_id;
      `;
    const rawData = await this.connection.query(sql, [id]);
    const room = `room-${id}`;
    const notiValues = rawData.map((item) => {
      return {
        title: title,
        content: `<h5>Thông báo từ lớp học ${item.title} </h5> <p>${message}</p> <h5>Trân trọng, </h5> <h5>${teacher.fullname}</h5>`,
        from: teacher.id,
        to: item.studentId,
      };
    });
    await this.connection
      .getRepository(Notifications)
      .createQueryBuilder()
      .insert()
      .values(notiValues)
      .execute();

    const payload = {
      avatarUrl: teacher.avatarUrl,
      userName: teacher.fullname,
      message: `<h5>Thông báo từ lớp học ${rawData[0].title} </h5> <p>${message}</p> <h5>Trân trọng, </h5> <h5>${teacher.fullname}</h5>`,
      title: title,
      time: 0,
    };
    this.gatewayService.pushNotification(room, payload, MESSAGE_TYPE.COURSES);
  }

  async pushScores(id: number, gradeIds: number[], title: string, url = null) {
    if (!gradeIds || !gradeIds.length) {
      return;
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

    const notiValues = rawData.map((item) => {
      const message = `Điểm ${item.gradeName} của bạn là: ${item.score}`;
      return {
        title: title,
        content: `<h5>Thông báo từ lớp học ${item.courseName} </h5> <p>${message}</p> <p>Xem chi tiết điểm <a href=${process.env.CLIENT_URL}/course/${id}?tab=score>tại đây</a></p> <h5>Trân trọng, </h5> <h5>${item.teacherName}</h5>`,
        from: item.teacherId,
        to: item.studentId,
      };
    });
    await this.connection
      .getRepository(Notifications)
      .createQueryBuilder()
      .insert()
      .values(notiValues)
      .execute();

    const payload = rawData.reduce((acc, cur) => {
      const message = `Điểm ${cur.gradeName} của bạn là: ${cur.score} điểm`;
      const item = {
        avatarUrl: cur.teacherAvatar,
        userName: cur.teacherName,
        message: `<h5>Thông báo từ lớp học ${cur.courseName} </h5> <p>${message}</p> <p>Xem chi tiết điểm <a href=${process.env.CLIENT_URL}/course/${id}?tab=score>tại đây</a></p> <h5>Trân trọng, </h5> <h5>${cur.teacherName}</h5>`,
        title: title,
        time: 0,
      };
      if (!acc[cur.studentId]) {
        acc[cur.studentId] = [item];
      } else {
        acc[cur.studentId].push(item);
      }
      return acc;
    }, {});

    this.gatewayService.pushNotification(room, payload, MESSAGE_TYPE.SCORES);
  }

  async pushRequestReview(id: number, scoreId: number, teacherIds: string) {
    const room = `room-${id}`;
    const data = await this.connection.getRepository(RequestReview).findOne({
      where: {
        scoreId: scoreId,
      },
      order: {
        messages: {
          order: 'ASC',
        },
      },
      relations: ['score', 'messages', 'score.grade', 'score.student'],
    });
    const payload = {
      [teacherIds]: data,
    };

    this.gatewayService.pushNotification(
      room,
      payload,
      MESSAGE_TYPE.REQUEST_REVIEW,
    );
  }

  async pushNotificationAcceptRequest(
    id: number,
    scoreId: number,
    _message: string,
    score: number,
  ) {
    const room = `room-${id}`;
    const sql = `
      SELECT s.score,
      u1.id as studentId,
      u1.fullname as studentName,
      u2.id as teacherId,
      u2.fullname as teacherName,
      u2.avatar_url as teacherAvatar,
      gc.name as gradeName,
      c.title
    FROM scores s, users u1, users u2, grade_compositions gc, courses c
    WHERE s.student_id = u1.student_id
    AND s.teacher_id = u2.id
    AND gc.id = s.grade_id
    AND gc.course_id = c.id
    AND s.id = ?;`;

    const rawData = await this.connection.query(sql, [scoreId]);
    if (!rawData || !rawData.length) {
      return;
    }
    const data = rawData[0];
    const messageRes = `Điểm sau khi phúc khảo của em là: ${score} điểm`;

    const payload = {
      [data.studentId]: {
        avatarUrl: data.teacherAvatar, 
        userName: data.teacherName,
        message: `<h5>Thông báo từ lớp học ${data.title} </h5> <p>${messageRes}</p> <p>Xem chi tiết yêu cầu phúc khảo <a href=${process.env.CLIENT_URL}/course/${id}?tab=score&scoreId=${scoreId}>tại đây</a></p> <h5>Trân trọng, </h5> <h5>${data.teacherName}</h5>`,
        title: `Thông báo phúc khảo ${data.gradeName}`,
        time: 0,
      },
    };

    await this.connection
      .getRepository(Notifications)
      .createQueryBuilder()
      .insert()
      .values([
        {
          title: `Thông báo phúc khảo ${data.gradeName}`,
          content: `<h5>Thông báo từ lớp học ${data.title} </h5> <p>${messageRes}</p> <p>Xem chi tiết yêu cầu phúc khảo <a href=${process.env.CLIENT_URL}/course/${id}?tab=score&scoreId=${scoreId}>tại đây</a></p> <h5>Trân trọng, </h5> <h5>${data.teacherName}</h5>`,
          from: data.teacherId,
          to: data.studentId,
        },
      ])
      .execute();

    this.gatewayService.pushNotification(
      room,
      payload,
      MESSAGE_TYPE.ACCEPT_REQUEST_REVIEW,
    );
  }

  async pushNotificationRequestReview(
    id: number,
    scoreId: number,
    teacherIds: string,
    message: string,
  ) {
    const room = `room-${id}`;
    const sql = `
      SELECT s.score,
             u1.id as studentId,
             u1.fullname as studentName,
             u2.id as teacherId,
             u2.fullname as teacherName,
             u1.avatar_url as studentAvatar,
             gc.name as gradeName,
             c.title
      FROM scores s, users u1, users u2, grade_compositions gc, courses c
      WHERE s.student_id = u1.student_id
        AND s.teacher_id = u2.id
        AND gc.id = s.grade_id
        AND gc.course_id = c.id
        AND s.id = ?;`;

    const rawData = await this.connection.query(sql, [scoreId]);
    if (!rawData || !rawData.length) {
      return;
    }
    const data = rawData[0];

    const payload = {
      [teacherIds]: {
        avatarUrl: data.studentAvatar,
        userName: data.studentName,
        message: `<h5>Thông báo xin được phúc khảo điểm ở lớp ${data.title} </h5> <p>${message}</p> <p>Xem chi tiết yêu cầu phúc khảo <a href=${process.env.CLIENT_URL}/course/${id}?tab=request-review&scoreId=${scoreId}>tại đây</a></p> <h5>Trân trọng, </h5> <h5>${data.studentName}</h5>`,
        title: `Thông báo xin được phúc khảo ${data.gradeName}`,
        time: 0,
      },
    }; 
    await this.connection
      .getRepository(Notifications)
      .createQueryBuilder()
      .insert()
      .values([
        {
          title: `Thông báo xin được phúc khảo ${data.gradeName}`,
          content: `<h5>Thông báo xin được phúc khảo điểm ở lớp ${data.title} </h5> <p>${message}</p> <p>Xem chi tiết yêu cầu phúc khảo <a href=${process.env.CLIENT_URL}/course/${id}?tab=request-review&scoreId=${scoreId}>tại đây</a></p> <h5>Trân trọng, </h5> <h5>${data.studentName}</h5>`,
          from: data.studentId,
          to: data.teacherId,
        },
      ])
      .execute();

    this.gatewayService.pushNotification(
      room,
      payload,
      MESSAGE_TYPE.NOTIFICATION_REQUEST_REVIEW,
    );
  }
}

import {NextFunction} from "express";
import {Injectable, NestMiddleware} from "@nestjs/common";
import { Response, Request } from "express";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }
    const [, accessToken] = authorizationHeader.split(' ');

    if (!accessToken) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    let isTokenValid = true;
    try {
      this.jwtService.verify(accessToken);
    } catch (e) {
      isTokenValid = false;
      return res.status(401).json({
        statusCode: 401,
        message: 'Unauthorized'
      })
    } finally {
      if (isTokenValid) next();
    }
  }
}
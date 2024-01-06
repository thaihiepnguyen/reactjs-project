import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request): Promise<boolean> {
    let { userId, userName } = request.cookies;

    userId = userId ? userId : request.headers['x-user-id'];
    userName = userName ? userName : decodeURI(request.headers['x-user-name']);

    request.metaDataAuth = {
      userId: +userId,
      userName: userName,
    };
    return true;
  }
}

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
    const userIdHeader = request.headers['x-user-id'];
    const userNameHeader = request.headers['x-user-name'];

    request.metaDateAuth = {
      userId: +userIdHeader,
      userName: userNameHeader
    };
    return true
  }
}
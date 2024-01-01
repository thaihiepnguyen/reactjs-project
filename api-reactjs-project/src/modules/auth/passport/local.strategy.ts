import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  /*
   * When the validate() method returns a value, Passport will build a user object based on that value,
   * that value will be assigned to the Request object as req.user.
   *
   * @param username
   * @param password
   */
  async validate(username: string, password: string): Promise<any> {
    return await this.authService.validateUser(username, password);
  }
}

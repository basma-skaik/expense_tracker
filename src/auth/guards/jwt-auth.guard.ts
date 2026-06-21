import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // هنا كلمة jwt هي اللي بتربط مع ال ملف الستراتيجي
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context); // هنا هاي الفانكشن بتصير تدور على كلاس فيه: PassportStrategy(Strategy) و هو ملف : JwtStrategy
  }
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Please provide a valid access token to access this resource',
        )
      );
    }
    return user;
  }
}

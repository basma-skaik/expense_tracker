import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        // Extract the custom message if passed from service, otherwise use default string
        const message = data?.message || 'Request processed successfully';

        // Clean up the message property from the raw data object
        if (data && typeof data === 'object' && 'message' in data) {
          delete data.message;
        }

        return {
          success: true,
          statusCode,
          message,
          // Extract nested user object if it exists (from register logic), otherwise pass data directly
          data:
            data && typeof data === 'object' && 'user' in data
              ? data.user
              : data,
        };
      }),
    );
  }
}

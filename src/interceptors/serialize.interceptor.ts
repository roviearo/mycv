import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDto } from 'src/users/dtos/user.dto';

export class SerilizeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    console.log('im  running before the handler', context);

    return next.handle().pipe(
      map((data: any) => {
        return plainToClass(UserDto, data, {
          excludeExtraneousValues: true
        })
      }),
    );
  }
}

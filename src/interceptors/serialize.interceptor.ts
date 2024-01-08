import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassConsturctor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConsturctor) {
  return UseInterceptors(new SerilizeInterceptor(dto));
}

export class SerilizeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConsturctor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface PopulatedRequest extends Request {
  auth: any;
}

export const Auth = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<PopulatedRequest>();
  return request.auth;
});

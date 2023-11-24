import {createParamDecorator, ExecutionContext} from "@nestjs/common";
export const MetaDataAuth = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.metaDataAuth?.[data] : request.metaDataAuth;
  },
);

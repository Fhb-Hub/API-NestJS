import { ExecutionContext, NotFoundException, createParamDecorator } from "@nestjs/common";

export const User = createParamDecorator((filter: string, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest().user
    
    if (!user) {
        throw new NotFoundException("User not found! Please, use AuthGuard to obtain the User.")
    }

    if (filter) {
        return user[filter]
    }

    return user;
}) 
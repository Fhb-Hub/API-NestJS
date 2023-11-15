import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    async canActivate(context: ExecutionContext) {
        try {
            const req = context.switchToHttp().getRequest();
            const { authorization } = req.headers;

            const data = this.authService.checkToken((authorization ?? '').split(' ')[1])
            req.user = await this.userService.show(data.id)
            //req.tokenPayload = data;

            return true
        } catch (e) {
            return false
        }
    }

}
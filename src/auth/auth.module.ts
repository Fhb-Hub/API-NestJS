import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";

@Module({
    imports: [
        forwardRef(() => UserModule),
        PrismaModule,
        JwtModule.register({
            // Atenção aos scapes ("/") e aos caracteres aspas simples, aspas duplas e crases
            secret: 'v7IKN@XTQ*39F&jqv*b)TwR(M@4nMDKW'
        })],
    controllers: [AuthController],
    providers: [AuthService],
    exports:  [AuthService]
})
export class AuthModule { }
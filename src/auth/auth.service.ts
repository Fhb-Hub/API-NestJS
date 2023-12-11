import { BadRequestException, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { FileService } from 'src/file/file.service';
import { join } from 'path';

@Injectable()
export class AuthService {

    private audience = "users"
    private issuer = "login"

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly fileService: FileService

    ) { }

    createToken(user: User) {
        return {
            accessToken: this.jwtService.sign({
                id: user.id,
                name: user.name,
                email: user.email
            }, {
                expiresIn: "7 days",
                subject: String(user.id),
                issuer: this.issuer,
                audience: this.audience
            })
        }
    }

    checkToken(token: string) {
        try {
            const data = this.jwtService.verify(token, {
                audience: this.audience,
                issuer: this.issuer
            })

            return data;
        } catch (err) {
            throw new BadRequestException(err)
        }
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token)
            return true
        } catch (err) {
            return true
        }
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findFirst({
            where: { email }
        })

        if (!user || !await bcrypt.compare(password, user.password)) {
            throw new UnauthorizedException('Incorrect email or password!');
        }

        return this.createToken(user);
    }

    async forget(email: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            throw new UnauthorizedException('Email not found!');
        }

        return true;
    }

    async reset(password: string, token: string) {
        const id: number = 1;

        const user = await this.prisma.user.update({
            where: { id },
            data: { password }
        })

        return this.createToken(user);
    }

    async register(data: AuthRegisterDTO) {
        const user = await this.userService.create(data);
        return this.createToken(user);
    }

    async uploadMyFile(saveFolder: string, userId: number, file: Express.Multer.File) {
        try {
            const saveDirectory = join(process.env.FILE_STORAGE , userId.toString(), saveFolder)
            file.path = this.fileService.generateSavePath(saveDirectory, file.originalname)

            await this.fileService.upload(file)
            return { success: true }
        } catch (err) {
           throw new BadRequestException(err)
        }
    }
}

import { Body, Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset-dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { join } from "path";

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('login')
    async login(@Body() { email, password }: AuthLoginDTO) {
        return this.authService.login(email, password);
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO) {
        return this.authService.register(body)
    }

    @Post('forget')
    async forget(@Body() { email }: AuthForgetDTO) {
        return this.authService.forget(email);
    }

    @Post('reset')
    async reset(@Body() { password, token }: AuthResetDTO) {
        return this.authService.reset(password, token);
    }

    @UseGuards(AuthGuard)
    @Post('me')
    async me(@User('email') email) {
        return { email }
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('photo'))
    @Post('photo')
    async uploadPhoto(
        @User('id') userId,
        @UploadedFile(new ParseFilePipe({
            validators: [
                new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
                new MaxFileSizeValidator({ maxSize: 1024 * 500 })
            ]
        })) photo: Express.Multer.File) {
        this.authService.uploadMyFile('photos', userId, photo)
        return { success: true }
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(FilesInterceptor('archives'))
    @Post('archives')
    async uploadArchives(@User('id') userId, @UploadedFiles() archives: Express.Multer.File[]) {
        archives.forEach(async archive => {
            this.authService.uploadMyFile('archives', userId, archive)
        })
        return { success: true }
    }


    @UseGuards(AuthGuard)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'personal', maxCount: 5 },
        { name: 'receipt', maxCount: 1 },
    ]))
    @Post('documents')
    async uploadDocuments(@User('id') userId, @UploadedFiles() documents: { personal: Express.Multer.File[], receipt: Express.Multer.File }) {

        this.authService.uploadMyFile(join('documents', 'receipt'), userId, documents.receipt[0]);

        documents.personal.forEach(async document => {
            this.authService.uploadMyFile(join('documents', 'personal'), userId, document);
        })

        return { success: true }
    }

}

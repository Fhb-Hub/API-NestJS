import { Body, Controller, Post, Get, Put, Patch, Delete, UseGuards } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user-dto";
import { UpdateUserDTO } from "./dto/update-user-dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user-dto";
import { UserService } from "./user.service";
import { ParamId } from "src/decorators/param-id.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enum";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
//import { LogInterceptor } from "src/interceptors/log.interceptor";

@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.Admin)
// @UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) { }

    //@UseInterceptors(LogInterceptor)
    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }

    @Get()
    async list() {
        return this.userService.list();
    }

    @Get(':id')
    async show(@ParamId() id: number) {
        return this.userService.show(id);
    }

    @Put(':id')
    async update(@ParamId() id: number, @Body() data: UpdateUserDTO) {
        return this.userService.update(id, data);
    }

    @Patch(':id')
    async updatePartial(@ParamId() id: number, @Body() data: UpdatePatchUserDTO) {
        return this.userService.updatePartial(id, data);
    }

    @Delete(':id')
    async delete(@ParamId() id: number) {
        return this.userService.delete(id);
    }
}
import { Body, Controller, Post, Get, Param, Put, Patch, Delete } from "@nestjs/common";

@Controller('users')
export class UserController {

    @Post()
    async create(@Body() body) {
        return { body }
    }

    @Get()
    async list() {
        return { users: [] }

    }

    @Get(':id')
    async readOne(@Param() params) {
        return { user: {}, params }
    }

    @Put(':id')
    async update(@Param() params, @Body() body) {
        return {
            method: 'PUT',
            body,
            params
        }
    }

    @Patch(':id')
    async updatePartial(@Param() params, @Body() body) {
        return {
            method: 'PATCH',
            body,
            params
        }
    }

    @Delete(':id')
    async delete(@Param() params) {
        return {
            method: 'DELETE',
            params
        }
    }
}
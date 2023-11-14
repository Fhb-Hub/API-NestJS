import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user-dto";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateUserDTO } from "./dto/update-user-dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user-dto";

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) { }

    async create({ name, birthday, email, password }: CreateUserDTO) {
        return this.prisma.user.create({
            data: {
                name,
                birthday: birthday ? new Date(birthday) : null,
                email,
                password
            },
        })
    }

    async list() {
        return this.prisma.user.findMany()
    }

    async show(id: number) {
        await this.exists(id);

        return this.prisma.user.findUnique({
            where: { id }
        })
    }

    async update(id: number, { name, birthday, email, password }: UpdateUserDTO) {
        await this.exists(id);

        return this.prisma.user.update({
            data: {
                name,
                birthday: birthday ? new Date(birthday) : null,
                email,
                password
            },
            where: { id }
        })
    }

    async updatePartial(id: number, { name, birthday, email, password }: UpdatePatchUserDTO) {
        await this.exists(id);

        const data: any = {}

        if (name) {
            data.name = name
        }

        if (birthday) {
            data.birthday = new Date(birthday)
        }

        if (email) {
            data.email = email
        }

        if (password) {
            data.password = password
        }

        return this.prisma.user.update({
            data,
            where: { id }
        })
    }

    async delete(id: number) {
        await this.exists(id);

        return this.prisma.user.delete({
            where: { id }
        })
    }

    async exists(id: number) {
        if (!(await this.prisma.user.count({
            where: { id }
        }))) {
            throw new NotFoundException(`The user ${id} does not exist!`)
        }
    }
}
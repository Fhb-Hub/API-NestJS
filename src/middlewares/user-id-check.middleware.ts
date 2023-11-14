import { BadRequestException, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class UserIdCheckMiddleware implements NestMiddleware {

    use(req: Request, res: Response, next: NextFunction) {
        const id = Number(req.params.id);

        if (isNaN(id) || id <= 0) {
            throw new BadRequestException("Invalid ID");
        }

        next();
    }

}
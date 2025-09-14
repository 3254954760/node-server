import { injectable, inject } from "inversify";
import { PrismaDB } from "@src/db/index.js";
import { UserDto } from "@src/user/user.dto.js";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { JWT } from "@src/jwt/index.js";
@injectable()
export class UserService {
    constructor(
        @inject(PrismaDB) private readonly PrismaDB: PrismaDB,
        @inject(JWT) private readonly jwt: JWT, //依赖注入
    ) { }
    public async getList() {
        return await this.PrismaDB.prisma.user.findMany();
    }

    public async createUser(user: UserDto) {
        let userDto = plainToClass(UserDto, user);
        const errors = await validate(userDto);
        if (errors.length) {
            return errors;
        } else {
            const result = await this.PrismaDB.prisma.user.create({
                data: user,
            });
            return {
                ...result,
                token: this.jwt.createToken(result), //生成token
            };
        }
    }
}

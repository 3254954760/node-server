import {
    controller,
    httpGet as GetMapping,
    httpPost as PostMapping,
} from "inversify-express-utils";
import { inject } from "inversify";
import { UserService } from "./service";
import type { Request, Response } from "express";
@controller("/user") //路由
export class UserController {
    constructor(
        @inject(UserService) private readonly userService: UserService, //依赖注入
    ) {}

    @GetMapping("/index") //get请求
    public async getIndex(req: Request, res: Response) {
        console.log(req?.user.id);
        const info = await this.userService.getUserInfo();
        res.send(info);
    }

    @PostMapping("/create") //post请求
    public async createUser(req: Request, res: Response) {
        const user = await this.userService.createUser(req.body);
        res.send(user);
    }
}

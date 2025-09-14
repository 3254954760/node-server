import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import { Container } from "inversify";
import { UserController } from "./src/user/controller";
import { UserService } from "./src/user/service";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaDB } from "./src/db";
const container = new Container(); //Ioc搞个容器
/**
 * prisma依赖注入
 */
//注入工厂封装db
container.bind<PrismaClient>("PrismaClient").toFactory(() => {
    return () => {
        return new PrismaClient();
    };
});
container.bind(PrismaDB).toSelf();
/**
 * user模块
 */
container.bind(UserService).to(UserService); //添加到容器
container.bind(UserController).to(UserController); //添加到容器
/**
 * post模块
 */
const server = new InversifyExpressServer(container); //返回server
//中间件编写在这儿
server.setConfig((app) => {
    app.use(express.json()); //接受json
});
const app = server.build(); //app就是express

app.listen(3000, () => {
    console.log("http://localhost:3000");
});

import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import { Container } from "inversify";
import { User } from "@src/user/controller.js";
import { UserService } from "@src/user/service.js";
import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaDB } from "@src/db/index.js";
import { JWT } from "@src/jwt/index.js";
const container = new Container();
/**
 * user模块
 */
container.bind(User).to(User);
container.bind(UserService).to(UserService);
/**
 *  封装PrismaClient
 */
container.bind<PrismaClient>("PrismaClient").toFactory(() => {
    return () => {
        return new PrismaClient();
    };
});
container.bind(PrismaDB).to(PrismaDB);
/**
 * jwt模块
 */
container.bind(JWT).to(JWT); //主要代码

const server = new InversifyExpressServer(container);
server.setConfig((app) => {
    app.use(express.json());
    app.use(container.get(JWT).init()); //主要代码
});
const app = server.build();

app.listen(3000, () => {
    console.log("Listening on port 3000");
});

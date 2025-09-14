const fs = require("fs");
const jsyaml = require("js-yaml");
const knex = require("knex");
const config = jsyaml.load(fs.readFileSync(`${__dirname}/db.config.yaml`));
const db = knex({
    client: "mysql2",
    connection: config.db,
    charset: "utf8mb4",
});
db.schema
    .createTableIfNotExists("list", (table) => {
        table.increments("id"); //id自增
        table.integer("age"); //age 整数
        table.string("name"); //name 字符串
        table.string("hobby"); //hobby 字符串
        table.timestamps(true, true); //创建时间和更新时间
    })
    .then((res) => {
        console.log("创建成功");
    });

const getAllData = async (req, res) => {
    const data = await db("list").select().orderBy("id", "desc");
    const total = await db("list").count("* as total");
    res.json({
        code: 200,
        data,
        total: total[0].total,
    });
};
const getUserById = async (req, res) => {
    const row = await db("list").select().where({ id: req.params.id });
    res.json({
        code: 200,
        data: row,
    });
};
const createUser = async (req, res) => {
    const { name, age, hobby } = req.body;
    const detail = await db("list").insert({ name, age, hobby });
    res.send({
        code: 200,
        data: detail,
    });
};

const updataUser = async (req, res) => {
    const { name, age, hobby, id } = req.body;
    const info = await db("list").update({ name, age, hobby }).where({ id });
    res.json({
        code: 200,
        data: info,
    });
};
const deleteUser = async (req, res) => {
    const info = await db("list").delete().where({ id: req.body.id });
    res.json({
        code: 200,
        data: info,
    });
};

module.exports = {
    getAllData,
    getUserById,
    createUser,
    updataUser,
    deleteUser,
};

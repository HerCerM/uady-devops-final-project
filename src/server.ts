import { StudentRouter } from "./routers/impl/StudentRouter";
import { CourseRouter } from "./routers/impl/CourseRouter";

import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";

const PORT = 8080;
const HOST = "0.0.0.0";

const app = express();

createConnection().then(() => {
  app.use("/api", StudentRouter().getAssembledRouter());
  app.use("/api", CourseRouter().getAssembledRouter());
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);

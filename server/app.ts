import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./src/routes/index";

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(router);

export { app };

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./src/routes/index";
import { corsOptions } from "./src/config/corsOptions";

const app = express();

app.use(cors(corsOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get('/api/server-status',(req,res) => {
    res.status(200).json({ message: "Server is up and running!" });
})

app.use(router);

export { app };

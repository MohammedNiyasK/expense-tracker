import dotenv from "dotenv";
import connectDB from "./src/db/config";
import { app } from "./app";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed : ", error);
  });

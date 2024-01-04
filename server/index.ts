import dotenv from "dotenv";
import connectDB from "./src/db/config";
import { app } from "./app";

dotenv.config();

const port = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`⚙️ Server is running at port: ${port}`);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed : ", error);
  });

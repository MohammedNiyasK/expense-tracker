import { CorsOptions } from "cors";
const allowedOrigins = ["https://www.yoursite.com", "http://localhost:5173"];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

export { corsOptions };

import { CorsOptions } from "cors";
const allowedOrigins = ["https://expense-tracker-6ish.vercel.app", "http://localhost:5173",
"http://localhost:8000"
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    console.log(origin)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

export { corsOptions };

import { Router } from "express";
import UserRoutes from "./user.routes";

const router = Router();

router.use("/api/user", UserRoutes);

export default router;

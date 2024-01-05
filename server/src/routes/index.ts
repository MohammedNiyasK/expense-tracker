import { Router } from "express";
import UserRoutes from "./user.routes";
import ExpenseRoutes from "./expense.routes";

const router = Router();

router.use("/api/user", UserRoutes);
router.use("/api/expense", ExpenseRoutes);

export default router;

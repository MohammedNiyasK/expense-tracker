import { Router } from "express";
import { createExpense } from "../controllers/expense.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.route("/create-expense").post(createExpense);

export default router;

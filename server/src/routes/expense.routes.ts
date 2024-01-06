import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expense.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJWT);

router.route("/all").get(getExpenses);

router.route("/create").post(createExpense);

router.route("/:expenseId").put(updateExpense);

router.route("/:expenseId").delete(deleteExpense);

export default router;

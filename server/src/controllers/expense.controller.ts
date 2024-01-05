import { asyncHandler } from "../utils/asyncHandler";
import { Expense } from "../models/expense.module";
import { ApiResponse } from "../utils/ApiResponse";

const createExpense = asyncHandler(async (req, res) => {
  const {
    description,
    amount,
    date,
    category,
  }: { description: string; amount: number; date: string; category: string } =
    req.body;

  const expense = await Expense.create({
    createdBy: req.user?._id,
    description,
    amount,
    date,
    category,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, expense, "Expense has been created succesfully")
    );
});

export { createExpense };

import { asyncHandler } from "../utils/asyncHandler";
import { Expense } from "../models/expense.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

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
      new ApiResponse(201, expense, "Expense has been created succesfully")
    );
});

const getExpenses = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const expenses = await Expense.find({ createdBy: userId });

  if (!expenses) {
    throw new ApiError({ message: "No expenses found", status: 404 });
  }

  res.status(200).json(new ApiResponse(200, expenses, "Expenses found."));
});

const updateExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;

  const updatedExpense = await Expense.findByIdAndUpdate(expenseId, req.body, {
    new: true,
  });

  if (!updatedExpense) {
    throw new ApiError({ message: "Expense not found", status: 404 });
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedExpense, "Expense updated succesfully"));
});

const deleteExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;

  const expense = await Expense.findById(expenseId);

  if (!expense) {
    throw new ApiError({ message: "Expense not found", status: 404 });
  }

  const deletedExpense = await Expense.findByIdAndDelete(expenseId);

  if (!deletedExpense) {
    throw new ApiError({ message: "Expense not found", status: 404 });
  }

  res.status(200).json(new ApiResponse(200, {}, "Expense deleted succesfully"));
});

export { createExpense, getExpenses, updateExpense, deleteExpense };

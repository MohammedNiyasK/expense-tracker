import { asyncHandler } from "../utils/asyncHandler";
import { Expense } from "../models/expense.model";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { WhereClause } from "../utils/WhereClause";
import mongoose from "mongoose";
import dayjs from "dayjs";

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

  const results: any = {};

  const countQuery = new WhereClause(
    Expense.find({ createdBy: userId }),
    req.query
  )
    .search()
    .filter();

  let count = await countQuery.base.countDocuments(); // Get count

  results.totalCount = count;

  // Query for pagination
  const paginationQuery = new WhereClause(
    Expense.find({ createdBy: userId }),
    req.query
  )
    .search()
    .filter()
    .pager();

  if (
    paginationQuery?.endIndex !== undefined &&
    paginationQuery.endIndex < count
  ) {
    results.next = {
      page: paginationQuery.currentPage + 1,
      limit: paginationQuery.resultPerPage,
    };
  }

  if (
    paginationQuery?.startIndex !== undefined &&
    paginationQuery.startIndex > 0
  ) {
    results.previous = {
      page: paginationQuery.currentPage - 1,
      limit: paginationQuery.resultPerPage,
    };
  }

  let expenses = await paginationQuery.base; // Get paginated results

  results.expenses = expenses;

  if (!expenses) {
    throw new ApiError({ message: "No expenses found", status: 404 });
  }
  res.status(200).json(new ApiResponse(200, results, "Expenses found."));
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

const recentExpenses = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const expenses = await Expense.find({ createdBy: userId })
    .sort({ _id: -1 })
    .limit(5);

  if (!expenses) {
    throw new ApiError({ message: "No recent expenses found", status: 404 });
  }

  res.status(200).json(new ApiResponse(200, expenses, "Recent expenses found"));
});

const getExpenseSummary = asyncHandler(async (req, res) => {
  const today = dayjs();

  const firstDayOfMonth = today.startOf("month").format("YYYY-MM-DD");
  const endDayOfMonth = today.endOf("month").format("YYYY-MM-DD");

  const userId = req.user?._id;

  const expenses = await Expense.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        date: {
          $gte: new Date(firstDayOfMonth),
          $lt: new Date(endDayOfMonth),
        },
      },
    },
    {
      $group: {
        _id: "$category",
        totalExpenses: { $sum: "$amount" },
      },
    },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: "$totalExpenses" },
        categories: { $push: { _id: "$_id", totalExpenes: "$totalExpenses" } },
      },
    },
  ]);

  if (!expenses) {
    throw new ApiError({ message: "No expenes found", status: 404 });
  }

  res
    .status(200)
    .json(new ApiResponse(200, expenses, "Expenses found succesfully"));
});

const getExpenseReport = asyncHandler(async (req, res) => {
  const { year, month } = req.query;
  const userId = req.user?._id;

  const expensesByCategory = await Expense.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        $expr: {
          $and: [
            { $eq: [{ $year: "$date" }, parseInt(year as string, 10)] },
            ...(month
              ? [{ $eq: [{ $month: "$date" }, parseInt(month as string, 10)] }]
              : []),
          ],
        },
      },
    },
    {
      $group: {
        _id: "$category",
        totalExpenses: { $sum: "$amount" },
      },
    },
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: "$totalExpenses" },
        categories: { $push: { _id: "$_id", totalExpenses: "$totalExpenses" } },
      },
    },
  ]);

  if (!expensesByCategory) {
    throw new ApiError({ message: "No expensesByCategory found", status: 404 });
  }

  const expenseData = await Expense.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
        $expr: {
          $and: [
            { $eq: [{ $year: "$date" }, parseInt(year as string, 10)] },
            ...(month
              ? [{ $eq: [{ $month: "$date" }, parseInt(month as string, 10)] }]
              : []),
          ],
        },
      },
    },

    ...(month
      ? [
          {
            $group: {
              _id: { $dayOfMonth: "$date" },
              totalExpenses: { $sum: "$amount" },
            },
          },
        ]
      : [
          {
            $group: {
              _id: { $month: "$date" },
              totalExpenses: { $sum: "$amount" },
            },
          },
        ]),

    {
      $group: {
        _id: null,
        totalExpenses: { $sum: "$totalExpenses" },
        categories: { $push: { _id: "$_id", totalExpenses: "$totalExpenses" } },
      },
    },
    {
      $unwind: "$categories",
    },
    {
      $sort: {
        "categories._id": 1,
      },
    },
    {
      $group: {
        _id: "$_id",
        totalExpenses: { $first: "$totalExpenses" },
        categories: { $push: "$categories" },
      },
    },
  ]);

  if (!expenseData) {
    throw new ApiError({ message: "No expenses found", status: 404 });
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { expensesByCategory, expenseData,year,month },
        "Expenses found succesfully"
      )
    );
});

export {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  recentExpenses,
  getExpenseSummary,
  getExpenseReport,
};

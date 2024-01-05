import { Schema, model } from "mongoose";

const expenseSchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      validate(value: number) {
        if (value <= 0) throw new Error("Amount must be greater than zero");
      },
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      required: true,
      enum: ["Food", "Transportation", "Entertainment", "Other"],
    },
  },
  {
    timestamps: true,
  }
);

export const Expense = model("Expense", expenseSchema);

import { NextRequest } from "next/server";
import dbConnect from "@/lib/mongoose";
import Expense from "@/models/Expense";
import mongoose from "mongoose";
import {
  handleApiError,
  createSuccessResponse,
  ApiError,
} from "@/lib/apiError";
import { HttpStatus } from "@/types/http";
import { ExpenseType, UpdateExpenseInput } from "@/types/expense";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params; // ✅ REQUIRED here

    if (!id) {
      throw new ApiError("Missing ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(
        "Invalid expense ID",
        HttpStatus.BAD_REQUEST,
        "The provided ID is not a valid MongoDB ObjectId"
      );
    }

    const expense = await Expense.findById(id).lean();

    if (!expense) {
      throw new ApiError(
        "Expense not found",
        HttpStatus.NOT_FOUND,
        `No expense found with ID: ${id}`
      );
    }

    const serializedExpense: ExpenseType = {
      _id: expense._id.toString(),
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      createdAt: expense.createdAt.toISOString(),
    };

    return createSuccessResponse(serializedExpense);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params; // ✅ REQUIRED here

    if (!id) {
      throw new ApiError("Missing ID", 400);
    }

    const body: UpdateExpenseInput = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(
        "Invalid expense ID",
        HttpStatus.BAD_REQUEST,
        "The provided ID is not a valid MongoDB ObjectId"
      );
    }

    // Validate amount if provided
    if (body.amount !== undefined && body.amount < 0) {
      throw new ApiError(
        "Invalid amount",
        HttpStatus.BAD_REQUEST,
        "Amount cannot be negative",
        [{ field: "amount", message: "Amount must be a positive number" }]
      );
    }

    const expense = await Expense.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!expense) {
      throw new ApiError(
        "Expense not found",
        HttpStatus.NOT_FOUND,
        `No expense found with ID: ${id}`
      );
    }

    const serializedExpense: ExpenseType = {
      _id: expense._id.toString(),
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      createdAt: expense.createdAt.toISOString(),
    };

    return createSuccessResponse(
      serializedExpense,
      HttpStatus.OK,
      "Expense updated successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params; // ✅ REQUIRED here

    if (!id) {
      throw new ApiError("Missing ID", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(
        "Invalid expense ID",
        HttpStatus.BAD_REQUEST,
        "The provided ID is not a valid MongoDB ObjectId"
      );
    }

    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      throw new ApiError(
        "Expense not found",
        HttpStatus.NOT_FOUND,
        `No expense found with ID: ${id}`
      );
    }

    return createSuccessResponse(
      { id: expense._id.toString() },
      HttpStatus.OK,
      "Expense deleted successfully"
    );
  } catch (error) {
    return handleApiError(error);
  }
}

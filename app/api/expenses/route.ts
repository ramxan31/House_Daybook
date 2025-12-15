import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Expense from '@/models/Expense';
import { 
  handleApiError, 
  createSuccessResponse, 
  ApiError 
} from '@/lib/apiError';
import { HttpStatus } from '@/types/http';
import { ExpenseType, CreateExpenseInput } from '@/types/expense';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get('month');
    const category = searchParams.get('category');

    const query: any = {};
    
    if (month) {
      const [year, monthNum] = month.split('-');
      if (!year || !monthNum) {
        throw new ApiError(
          'Invalid month format',
          HttpStatus.BAD_REQUEST,
          'Month should be in YYYY-MM format'
        );
      }

      const startDate = `${year}-${monthNum}-01`;
      const endDate = `${year}-${monthNum}-${new Date(parseInt(year), parseInt(monthNum), 0).getDate()}`;
      
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (category) {
      query.category = category;
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1, createdAt: -1 })
      .lean();

    const serializedExpenses: ExpenseType[] = expenses.map(expense => ({
      _id: expense._id.toString(),
      date: expense.date,
      category: expense.category,
      description: expense.description,
      amount: expense.amount,
      createdAt: expense.createdAt.toISOString(),
    }));

    return createSuccessResponse(serializedExpenses);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: CreateExpenseInput = await request.json();
    const { date, category, description, amount } = body;

    // Manual validation
    if (!date || !category || !description || amount === undefined) {
      throw new ApiError(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
        'All fields (date, category, description, amount) are required',
        [
          ...(!date ? [{ field: 'date', message: 'Date is required' }] : []),
          ...(!category ? [{ field: 'category', message: 'Category is required' }] : []),
          ...(!description ? [{ field: 'description', message: 'Description is required' }] : []),
          ...(amount === undefined ? [{ field: 'amount', message: 'Amount is required' }] : []),
        ]
      );
    }

    if (amount < 0) {
      throw new ApiError(
        'Invalid amount',
        HttpStatus.BAD_REQUEST,
        'Amount cannot be negative',
        [{ field: 'amount', message: 'Amount must be a positive number' }]
      );
    }

    const expense = await Expense.create({
      date,
      category,
      description,
      amount: parseFloat(amount.toString()),
    });

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
      HttpStatus.CREATED,
      'Expense created successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
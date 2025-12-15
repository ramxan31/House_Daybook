export interface ExpenseType {
  _id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateExpenseInput {
  date: string;
  category: string;
  description: string;
  amount: number;
}

export interface UpdateExpenseInput extends Partial<CreateExpenseInput> {}

export interface ExpenseQuery {
  month?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}



export interface MonthlyStats {
  total: number;
  count: number;
  byCategory: { [key: string]: number };
  average: number;
}
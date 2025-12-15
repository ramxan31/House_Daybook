import mongoose, { Schema, Model } from 'mongoose';

export interface IExpense {
  date: string;
  category: string;
  description: string;
  amount: number;
  createdAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    date: {
      type: String,
      required: [true, 'Please provide a date'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['Groceries', 'Utilities', 'Transportation', 'Healthcare', 'Entertainment', 'Maintenance', 'Other'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0, 'Amount cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by date
ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ createdAt: -1 });

const Expense: Model<IExpense> = 
  mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
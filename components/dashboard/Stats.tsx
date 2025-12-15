import { DollarSign, Tag, TrendingUp } from "lucide-react";
import React from "react";

interface MonthlyStats {
  total: number;
  byCategory: { [key: string]: number };
}

interface Expense {
  _id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  createdAt: string;
}

interface StatsProps {
  expenses: Expense[];
  stats: MonthlyStats;
  selectedMonth: string;
}

const Stats: React.FC<StatsProps> = ({ stats, expenses, selectedMonth }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Expenses</p>
            <p className="text-base sm:text-3xl font-bold text-gray-800">
              Rs. {stats?.total?.toFixed(2)}
            </p>
          </div>
          <DollarSign className="size-8 sm:size-12 text-teal-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Entries</p>
            <p className="text-base sm:text-3xl font-bold text-gray-800">
              {expenses.length}
            </p>
          </div>
          <Tag className="size-8 sm:size-12 text-green-500" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Avg per Day</p>
            <p className="text-base sm:text-3xl font-bold text-gray-800">
              Rs.{" "}
              {expenses?.length > 0
                ? (() => {
                    const [year, month] = selectedMonth.split("-").map(Number);
                    const daysInMonth = new Date(year, month, 0).getDate();
                    return (stats?.total / daysInMonth).toFixed(2);
                  })()
                : "0.00"}
            </p>
          </div>
          <TrendingUp className="size-8 sm:size-12 text-purple-500" />
        </div>
      </div>
    </div>
  );
};

export default Stats;

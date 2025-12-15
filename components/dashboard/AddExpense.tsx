import React, { useState } from "react";
import { Button, Input, Select } from "../UI";
import { Plus } from "lucide-react";
import { apiClient } from "@/lib/apiClient";

const CATEGORIES = [
  "Food & Groceries", // Combines groceries and cooking
  "Dining Out", // Restaurants and takeout
  "Utilities", // Electricity, water, gas
  "Transportation",
  "Healthcare",
  "Entertainment",
  "Home Maintenance",
  "Kitchen & Appliances", // Kitchen-specific items
  "Other",
];

interface MonthlyStats {
  total: number;
  byCategory: { [key: string]: number };
}

interface AddExpenseProps {
  stats: MonthlyStats;
  loadExpenses: () => void;
}

const AddExpense: React.FC<AddExpenseProps> = ({ stats, loadExpenses }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "Groceries",
    description: "",
    amount: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!formData.description || !formData.amount) return;
    setLoading(false);
    try {
      await apiClient.addExpense({
        date: formData.date,
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
      });

      setFormData({
        date: new Date().toISOString().split("T")[0],
        category: "Groceries",
        description: "",
        amount: "",
      });
      loadExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Add Expense
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g., Monthly groceries"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (Rs.)
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="0.00"
            />
          </div>

          <Button
            onClick={handleSubmit}
            isLoading={loading}
            disabled={loading}
            variant="primary"
            className="w-full"
          >
            Add Expense
          </Button>
        </div>

        {/* Category Breakdown */}
        <div className="mt-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            Category Breakdown
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.byCategory).map(([cat, amount]) => (
              <div key={cat} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{cat}</span>
                <span className="text-sm font-semibold text-gray-800">
                  Rs. {amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;

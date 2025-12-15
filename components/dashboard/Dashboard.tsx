"use client";

import { apiClient } from "@/lib/apiClient";
import { UserProfile } from "@/types/auth";
import { Calendar, LogOut, Trash2, User } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAlert } from "../Alert";
import DeleteDialog from "../DeleteDialog";
import { Button, Input } from "../UI";
import AddExpense from "./AddExpense";
import Stats from "./Stats";

// Types
interface Expense {
  _id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  createdAt: string;
}

interface MonthlyStats {
  total: number;
  byCategory: { [key: string]: number };
}

interface DashboardProps {
  handleLogout: () => void;
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user, handleLogout }) => {
  const alert = useAlert();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.getExpenses(selectedMonth);
      setExpenses(
        data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    } catch (error) {
      console.error("Error loading expenses:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  const stats = useMemo<MonthlyStats>(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const byCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as { [key: string]: number });

    return { total, byCategory };
  }, [expenses]);

  useEffect(() => {
    loadExpenses();
  }, [selectedMonth, loadExpenses]);

  const onDelete = (id: string) => {
    setDeletingId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    setShowModal(false);
    try {
      await apiClient.deleteExpense(deletingId);
      setDeletingId("");
      alert("Entry deleted successfully", "success", 5);
      loadExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <DeleteDialog
        open={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex flex-col items-start justify-start">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-2">
                House Daybook
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Track your daily household expenses
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <Button
                onClick={handleLogout}
                className=" flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <Stats
          stats={stats}
          selectedMonth={selectedMonth}
          expenses={expenses}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Expense Form */}
          <AddExpense loadExpenses={loadExpenses} stats={stats} />

          {/* Expenses List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4 gap-5">
                <h2 className="text-base sm:text-xl font-bold text-gray-800 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Expenses
                </h2>
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-max"
                />
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
              ) : expenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No expenses recorded for this month
                </div>
              ) : (
                <div className="space-y-3 max-h-150 overflow-y-auto">
                  {expenses.map((expense) => (
                    <div
                      key={expense._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-blue-600">
                              {new Date(expense.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {expense.category}
                            </span>
                          </div>
                          <p className="text-gray-800 font-medium">
                            {expense.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm sm:text-lg font-bold text-gray-800">
                            Rs. {expense.amount.toFixed(2)}
                          </span>
                          <button
                            onClick={() => onDelete(expense._id)}
                            className="cursor-pointer text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

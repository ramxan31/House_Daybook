import { ExpenseType, CreateExpenseInput } from "@/types/expense";
import {
  AuthResponse,
  LoginInput,
  RegisterInput,
  UserProfile,
} from "@/types/auth";

class ApiClient {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json();

      // Handle 401 errors (token expired)
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }

      throw new Error(errorData.error || "An error occurred");
    }
    const data = await response.json();
    return data.data || data;
  }

  // Auth methods
  async register(input: RegisterInput): Promise<AuthResponse> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = await this.handleResponse<AuthResponse>(response);

    // Store token in localStorage
    if (result.token) {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("userData", JSON.stringify(result.user));
    }

    return result;
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = await this.handleResponse<AuthResponse>(response);

    // Store token in localStorage
    if (result.token) {
      localStorage.setItem("authToken", result.token);
      localStorage.setItem("userData", JSON.stringify(result.user));
    }

    return result;
  }

  async getMe(): Promise<UserProfile> {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: { "Content-Type": "application/json", ...this.getAuthHeader() },
    });
    const result = await this.handleResponse<UserProfile>(response);

    // Store token in localStorage
    if (result) {
      localStorage.setItem("userData", JSON.stringify(result));
    }

    return result;
  }

  async logout() {
    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  }

  // Expense methods
  async getExpenses(month: string): Promise<ExpenseType[]> {
    const response = await fetch(`/api/expenses?month=${month}`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse<ExpenseType[]>(response);
  }

  async addExpense(expense: CreateExpenseInput): Promise<ExpenseType> {
    const response = await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(expense),
    });
    return this.handleResponse<ExpenseType>(response);
  }

  async deleteExpense(id: string): Promise<void> {
    const response = await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeader(),
    });
    await this.handleResponse<void>(response);
  }
}

export const apiClient = new ApiClient();

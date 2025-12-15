import {
  ApiError,
  createSuccessResponse,
  handleApiError,
} from "@/lib/apiError";
import { signToken } from "@/lib/jwt";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { LoginInput } from "@/types/auth";
import { HttpStatus } from "@/types/http";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: LoginInput = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      throw new ApiError(
        "Missing required fields",
        HttpStatus.BAD_REQUEST,
        "Email and password are required"
      );
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new ApiError(
        "Invalid credentials",
        HttpStatus.UNAUTHORIZED,
        "Email or password is incorrect"
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new ApiError(
        "Invalid credentials",
        HttpStatus.UNAUTHORIZED,
        "Email or password is incorrect"
      );
    }

    // Generate JWT token
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const response = {
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    };

    

    return createSuccessResponse(response, HttpStatus.OK, "Login successful");
  } catch (error) {
    return handleApiError(error);
  }
}

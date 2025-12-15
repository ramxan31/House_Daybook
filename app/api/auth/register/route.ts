import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';
import { handleApiError, createSuccessResponse, ApiError } from '@/lib/apiError';
import { HttpStatus } from '@/types/http';
import { RegisterInput } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: RegisterInput = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      throw new ApiError(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
        'Name, email, and password are required'
      );
    }

    if (password.length < 6) {
      throw new ApiError(
        'Invalid password',
        HttpStatus.BAD_REQUEST,
        'Password must be at least 6 characters long',
        [{ field: 'password', message: 'Password must be at least 6 characters' }]
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(
        'Email already exists',
        HttpStatus.CONFLICT,
        'A user with this email already exists'
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    });

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

    return createSuccessResponse(response, HttpStatus.CREATED, 'Registration successful');
  } catch (error) {
    return handleApiError(error);
  }
}
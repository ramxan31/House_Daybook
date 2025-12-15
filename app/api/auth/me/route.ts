import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { verifyAuth } from '@/lib/authMiddleware';
import { handleApiError, createSuccessResponse, ApiError } from '@/lib/apiError';
import { HttpStatus } from '@/types/http';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { userId } = verifyAuth(request);
    const user = await User.findById(userId);
    
    if (!user) {
      throw new ApiError(
        'User not found',
        HttpStatus.NOT_FOUND,
        'The authenticated user no longer exists'
      );
    }

    const response = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    return createSuccessResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
}
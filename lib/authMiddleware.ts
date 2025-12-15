import { NextRequest } from 'next/server';
import { verifyToken, JWTPayload } from './jwt';

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

export function verifyAuth(request: NextRequest): JWTPayload {
  const token = getAuthToken(request);
  
  if (!token) {
    throw new Error('No authentication token provided');
  }
  
  return verifyToken(token);
}
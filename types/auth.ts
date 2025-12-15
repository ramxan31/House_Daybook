export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: true;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

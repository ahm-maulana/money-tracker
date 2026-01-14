export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SessionResponse {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

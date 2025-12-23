import { User } from "../generated/prisma/client";

export type UserWithoutPassword = Omit<User, "password">;
export function excludePassword(user: User): UserWithoutPassword {
  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export interface AuthResponse {
  user: UserWithoutPassword;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

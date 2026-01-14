class TokenManager {
  private token: string | null = null;

  // Get token
  getToken(): string | null {
    return this.token;
  }

  // Set token
  setToken(token: string | null): void {
    this.token = token;
  }

  // Clear token
  clearToken(): void {
    this.token = null;
  }
}

export const tokenManager = new TokenManager();

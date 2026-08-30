export interface LoginRequest {
  employeeCode: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  employeeCode: string;
  name: string;
  avatarId: number;
}
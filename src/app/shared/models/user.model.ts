export interface User {
  userId: number;
  userName: string;
  email: string;
  fullName?: string;
  role: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  fullName?: string;
}

export type AuthUser = {
  userId: string;
  email: string;
};

export type AuthResponse = AuthUser;

export type ErrorResponse = {
  code: number;
  name: string;
  message: string;
};

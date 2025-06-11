// DTOs pour correspondre au backend C#

export interface ChangePasswordDto {
  UserId: number;
  NewPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface LoginDto {
  Email: string;
  Password: string;
}

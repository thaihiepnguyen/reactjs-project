export interface User {
  id: number;
  studentId: string;
  fullname: string;
  email: string;
  password: string;
  avatarUrl: string;
  phone: string;
  role: Role;
  isValid: boolean;
  isActive: boolean;
}

export interface Role {
  id: number;
  name: string;
}

export interface Role {
  id: number,
  name: string,
}
export interface User {
  id: number;
  studentId: string;
  fullname: string,
  email: string,
  avatarUrl: string,
  phone: string,
  role: Role,
  isValid: boolean
}

export interface Role {
  id: number,
  name: string,
}
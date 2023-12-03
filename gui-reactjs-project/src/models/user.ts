export interface User {
  fullname: string,
  email: string,
  avatarUrl: string,
  phone: string,
  role: Role
}

export interface Role {
  id: number,
  name: string,
}
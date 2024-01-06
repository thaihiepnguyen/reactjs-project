export enum EAPI {
  token = "token",
}

export interface TableHeaderLabel {
  name: string;
  label: string;
  sortable: boolean;
  align?: "center" | "inherit" | "justify" | "left" | "right";
}

export interface SortItem {
  sortedField: string;
  isDescending: boolean;
}

export interface OptionItem<T = number> {
  id: T;
  name: string;
  fullName?: string;
  translation?: any;
  img?: string;
  subName?: string;
  icon?: any;
}

export enum EAdminType {
  STUDENT = 1,
  TEACHER = 2,
  ADMIN = 3,
}

export const adminTypes: OptionItem[] = [
  {
    id: EAdminType.ADMIN,
    name: "Admin",
  },
  {
    id: EAdminType.STUDENT,
    name: "Student",
  },
  {
    id: EAdminType.TEACHER,
    name: "Teacher",
  },
];

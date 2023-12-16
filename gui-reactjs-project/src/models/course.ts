export interface Course {
    classCode?: string;
    id?: number;
    isValid?: boolean;
    isActive?: boolean;
    title?: string;
    description?: string;
    teacherId?: number;
    createdAt?: string;
    updatedAt?: string;
    lastModify?: any;
    teacherName?: string;
    teacherAvatar?: string;
  }
  
  export interface Role {
    id: number;
    name: string;
  }

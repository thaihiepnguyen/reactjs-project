export interface Course {
    classCode?: string;
    id?: number;
    isValid?: boolean;
    isActive?: boolean;
    title?: string;
    description?: string;
    teacher_id?: number;
    class_code?: string;
    created_at?: string;
    updated_at?: string;
    lastModify?: any;
    teacherName?: string;
    teacherAvatar?: string;
  }
  
  export interface Role {
    id: number;
    name: string;
  }

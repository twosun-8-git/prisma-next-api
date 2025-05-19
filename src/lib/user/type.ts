export type User = {
  email: string;
  name?: string;
  age?: number;
  isAdmin: boolean;
  scores?: {
    Langage: number;
    Arithmetic: number;
    Science: number;
    Math: number;
  };
};

export type GetUser = {
  email: string;
  scores?: boolean;
};

export type UserData = {
  id: number;
  email: string;
  name?: string | null;
  age?: number | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  scores?: {
    id: number;
    Langage: number;
    Arithmetic: number;
    Science: number;
    Math: number;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export type CreateUserResult = {
  status: boolean;
  data?: UserData;
  error?: {
    code: string;
    message: string;
  };
};

export type UpdateUser = User;

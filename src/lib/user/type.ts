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

export type CreateUser = User & {
  name: string;
};

export type UpdateUser = User;

export type DeleteUser = {
  email: string;
};

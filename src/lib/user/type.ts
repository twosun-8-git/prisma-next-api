export type User = {
  email: string;
  name?: string;
  age?: number;
  isAdmin: boolean;
  scores?: Score;
};

export const SCORE_FIELDS = [
  "Langage",
  "Arithmetic",
  "Science",
  "Math",
] as const;
export type ScoreKey = (typeof SCORE_FIELDS)[number];
export type Score = {
  [K in ScoreKey]?: number;
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

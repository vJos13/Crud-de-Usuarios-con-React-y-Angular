export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export type UserInput = Pick<User, 'name' | 'email'>;

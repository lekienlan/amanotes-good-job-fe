export type Role = 'USER' | 'ADMIN' | 'HR';

export interface User {
  id?: string;
  user_name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  points_balance?: number; // Points received (can spend)
  giving_budget?: number; // Points can give (resets monthly)
  last_budget_reset?: string;
  role?: Role;
  department?: string;
  created_at?: string;
  updated_at?: string;
}

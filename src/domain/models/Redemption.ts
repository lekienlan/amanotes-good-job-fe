export interface Redemption {
  id?: string;
  user_id?: string;
  reward_id?: string;
  points_spent?: number;
  status?: 'PENDING' | 'APPROVED' | 'FULFILLED' | 'CANCELLED';
  created_at?: string;
  updated_at?: string;
}

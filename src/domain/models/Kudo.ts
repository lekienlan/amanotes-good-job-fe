import type { Reaction } from './Reaction';

export interface Kudo {
  id?: string;
  sender_id?: string;
  receiver_id?: string;
  points?: number;
  description?: string;
  core_value_id?: string;
  created_at?: string;
  updated_at?: string;
  reactions?: Reaction[];
}

export interface Account {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface AccountWithBalance extends Account {
  balance: number; // computed: sum of income - sum of expenses (transfers excluded)
}

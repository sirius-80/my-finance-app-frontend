export interface Balance {
  date: Date;
  amount: number;
}
export interface Combined {
  date: Date;
  balance: number;
  income: number;
  expenses: number;
  profit: number;
  loss: number;
}

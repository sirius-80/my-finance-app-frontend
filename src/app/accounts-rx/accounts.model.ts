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

export class Category {
  constructor(public id: string, public name: string) {}
}

export interface CategoryData {
  name: string;
  value: number;
  children: CategoryData[];
}

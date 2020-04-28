export class Balance {
  constructor(public date: Date, public amount: number) {}
}

export class Combined {
  constructor(public date: Date, public balance: number, public income: number, public expenses: number, public profit: number, public loss: number) {}

  public add(other: Combined) {
    if (this.date.getTime() != other.date.getTime()) {
      throw new Error('Can only add Combined data with the same date!');
    }
    const profitOrLoss = this.profit + other.profit + this.loss + other.loss;
    return new Combined(this.date,
      this.balance + other.balance,
      this.income + other.income,
      this.expenses + other.expenses,
      profitOrLoss > 0 && profitOrLoss || 0,
      profitOrLoss < 0 && profitOrLoss || 0,
    );
  }
}


import { Category } from 'src/app/accounts-rx/accounts.model'
import { Entity, DomainEvent } from '../entity';
import { v4 as uuid4 } from 'uuid';


/**
 * Domain event that indicates that the category of a transaction is updated.
 */
export class TransactionCategorizedEvent implements DomainEvent {
    constructor(public transaction: Transaction, public oldCategory: Category, public newCategory: Category) { }
}

/**
 * Domain event that indicates that a transaction has been flagged as 'internal' (i.e. between own accounts).
 */
export class TransactionSetInternalEvent implements DomainEvent {
    constructor(public transaction: Transaction, public oldInternalFlag: boolean, public newInternalFlag: boolean) { }
}

/**
 * Domain event that indicates that a new account has been created.
 */
export class AccountCreatedEvent implements DomainEvent {
    constructor(public account: Account) { }
}

/**
 * Domain event that indicates that a new transaction has been created.
 */
export class TransactionCreatedEvent implements DomainEvent {
    constructor(public transaction: Transaction) { }
}

/**
 * Represents a transaction on a owned account.
 */
export class Transaction extends Entity {
    public internal = false;
    public category: Category = null;

    constructor(public transactionId: string,
        public account: Account,
        public serial: number,
        public date: Date,
        public amount: number,
        public name: string,
        public description: string,
        public counterAccount: string,
        public balanceAfter: number) {
        super(transactionId);
    }

    /**
     * Updates the category on this transaction.
     * @param category category to assign to this transaction
     */
    updateCategory(category: Category): void {
        this.registerDomainEvent(new TransactionCategorizedEvent(this, this.category, category));
        this.category = category;
    }

    /**
     * Marks this transaction as 'internal' if internal is True, or 'not internal' otherwise.
     * @param internal 
     */
    setInternal(internal: boolean): void {
        this.registerDomainEvent(new TransactionSetInternalEvent(this, this.internal, internal));
        this.internal = internal;
    }
}

export class Account extends Entity {
    private transactions: Transaction[] = [];
    constructor(private accountId: string, private name: string, private bank: string) {
        super(accountId);
     }

    /**
     * Returns the combined amount of transactions in the year and (optional) month for
     * given (optional) category
     * @param year Year to filter on
     * @param month Optional month to filter on
     * @param category Optional category to filter on
     */
    getCombinedAmountForCategory(category: Category, year: number, month: number = null): number {
        return this.transactions.filter(
            (t) => t.date.getFullYear() === year
                && (!month || t.date.getMonth() === month)
                && (!category || t.category.id === category.id)
        ).reduce((sum, t) => sum + t.amount, 0);
    }

    /**
     * Returns the last transaction at given date, or the last transaction that occurred before this date, if
     * no transaction occurred on this specific date.
     * @param date 
     */
    private getLastTransactionAtOrBefore(date: Date): Transaction {
        return this.transactions.reduce((last, t) => t.date <= date && t || last);
    }

    /**
     * Returns the account balance at given date, or 0 if given date predates the first transaction on this account.
     * @param date 
     */
    getBalanceAt(date: Date): number {
        const transaction = this.getLastTransactionAtOrBefore(date);
        if (transaction) {
            return transaction.balanceAfter;
        } else {
            return 0;
        }
    }

    /**
     * Returns the list of transactions of given category that falls after given start_date (inclusive) and before
        given end_date(exclusive), of given category (or any category if provided category is null or undefined)
     * @param start Optional start-date to filter on
     * @param end Optional end-date to filter on
     * @param category Optional category to filter on
     */
    getTransactions(start: Date = null, end: Date = null, category: Category = null): Transaction[] {
        return this.transactions.filter(t => (!start || t.date >= start)
            && (!end || t.date < end)
            && (!category || t.category.id === category.id));
    }

    /**
     * Adds given transaction to this account. Note that the caller is responsible that transactions are only added once to an account.
     * @param transaction 
     */
    addTransaction(transaction: Transaction): void {
        this.transactions.push(transaction);
    }

    /**
     * Returns the date of the first transaction on this account, or null if there are no transactions present.
     */
    getFirstTransactionDate(): Date {
        return this.transactions && this.transactions[0].date || null;
    }

    /**
     * Returns the date of the last transaction on this account, or null if there are no transactions present.
     */
    getLastTransactionDate(): Date {
        return this.transactions && this.transactions[this.transactions.length - 1].date || null;
    }

    /**
     * Returns all transactions in given account that exactly match given set of attributes.
     * @param date 
     * @param serial 
     * @param amount 
     * @param name 
     * @param counterAccount 
     * @param description 
     */
    findTransactionsByAttributes(date: Date, serial: number, amount: number, name: string, counterAccount: string, description: string): Transaction[] {
        return this.transactions.filter(t => t.date == date 
            && t.serial == serial
            && t.amount == amount
            && t.name == name
            && t.counterAccount == counterAccount
            && t.description == description);    
    }
}

/**
 * Repository to hold accounts and their transactions.
 */
export interface AccountRepository {
    getAccounts(): Account[];

    getAccount(accountId: string): Account;

    getAccountByNameAndBank(name: string, bank: string): Account;

    saveAccount(account: Account): Account;

    getTransaction(transactionId: string): Transaction;

    saveTransaction(transaction: string): Transaction;
}

/**
 * Factory to create new Account and Transaction entities. Note that the caller is responsible to save the created
 * instances using an AccountRepository.
 */
export class AccountFactory {
    static createAccount(name: string, bank: string): Account {
        const account = new Account(uuid4(), name, bank);
        account.registerDomainEvent(new AccountCreatedEvent(account));
        return account;
    }
    
    
    static createTransaction(account: Account, date: Date, amount: number, name: string, description: string, serial: number, counter_account: string, balance_after: number) {
        const transaction = new Transaction(uuid4(), account, serial, date, amount, name, description, counter_account, balance_after);
        transaction.registerDomainEvent(new TransactionCreatedEvent(transaction));
        return transaction;
    }
    
}

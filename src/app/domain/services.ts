import { Category } from '../accounts-rx/accounts.model'
import { Transaction } from './account/account'

/**
 * Superclass for mappers that can map a given transaction to one or more specific categories. Every category
 * match is scored (numerical), where a higher score means a better match.
 */
export interface TransactionCategoryMapper {
    /**
     * Returns a (possibly empty) list of CategoryScore objects, representing the matching categories and their
     * respective scores for given transaction.
     */
    getCategoryScores(transaction: Transaction): {category: Category, score: number};
}


export interface InternalTransactionDetector {
    /**
     * Returns True if, and only if, given transaction is an internal transaction (i.e. between own accounts).
     */
    isInternalTransaction(transaction: Transaction): boolean;
}

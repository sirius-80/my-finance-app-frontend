import { Action } from '@ngrx/store';

export const UPLOAD_TRANSACTIONS = 'UPLOAD_TRANSACTIONS';

export class UploadTransactions implements Action {
    readonly type = UPLOAD_TRANSACTIONS;
    constructor(public payload: string) {}
}

export type UploadActions = UploadTransactions;
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createFeatureSelector } from "utils/ducks";
import { AcmeAccountListModel, AcmeAccountModel } from "models/acme-accounts";

export type State = {
    isFetchingList: boolean;
    isFetchingDetail: boolean;
    isDeleting: boolean;
    accounts: AcmeAccountListModel[];
    account: AcmeAccountModel | null;
    confirmDeleteAccount: string;
};

export const initialState: State = {
    isFetchingList: false,
    isFetchingDetail: false,
    isDeleting: false,
    accounts: [],
    account: null,
    confirmDeleteAccount: "",
};

export const slice = createSlice({

    name: "acmeAccounts",

    initialState,

    reducers: {
        listAcmeAccounts: (state, action: PayloadAction<void>) => {
            state.isFetchingList = true;
        },

        listAcmeAccountsSuccess: (state, action: PayloadAction<AcmeAccountListModel[]>) => {
            state.accounts = action.payload;
            state.isFetchingList = false;
        },

        listAcmeAccountsFailed: (state, action: PayloadAction<string | undefined>) => {
            state.isFetchingList = false
        },

        getAcmeAccount: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = true;
        },

        getAcmeAccountSuccess: (state, action: PayloadAction<AcmeAccountModel>) => {
            state.account = action.payload;
            state.isFetchingDetail = false;
        },

        getAcmeAccountFailed: (state, action: PayloadAction<string | undefined>) => {
            state.isFetchingDetail = false
        },

        deleteAcmeAccount: (state, action: PayloadAction<string>) => {
            state.isDeleting = true
        },
        deleteAcmeAccountSuccess: (state, action: PayloadAction<string>) => {
            state.isDeleting = false;

            const accountIndex = state.accounts.findIndex(account => account.uuid === action.payload);
            if (accountIndex >= 0) state.accounts.splice(accountIndex, 1);

            if (state.account?.uuid === action.payload) state.account = null;
        },
        deleteAcmeAccountFailed: (state, action: PayloadAction<string | undefined>) => {
            state.isDeleting = false
        },
        enableAcmeAccount: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = true;
        },
        enableAcmeAccountSuccess: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = false;
            const accountIndex = state.accounts.findIndex(account => account.uuid === action.payload);
            if (accountIndex >= 0) state.accounts[accountIndex].enabled = true;
        },
        enableAcmeAccountFailed: (state, action: PayloadAction<string | undefined>) => {
            state.isFetchingDetail = false
        },
        disableAcmeAccount: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = true;
        },
        disableAcmeAccountSuccess: (state, action: PayloadAction<string>) => {
            state.isFetchingDetail = false;
            const accountIndex = state.accounts.findIndex(account => account.uuid === action.payload);
            if (accountIndex >= 0) state.accounts[accountIndex].enabled = false;
        },
        disableAcmeAccountFailed: (state, action: PayloadAction<string | undefined>) => {
            state.isFetchingDetail = false
        },
        bulkDeleteAcmeAccounts: (state, action: PayloadAction<string[]>) => {
            state.isDeleting = true
        },
        bulkDeleteAcmeAccountsSuccess: (state, action: PayloadAction<string[]>) => {
            state.isDeleting = false;
            action.payload.forEach(uuid => {
                const accountIndex = state.accounts.findIndex(account => account.uuid === uuid);
                if (accountIndex >= 0) state.accounts.splice(accountIndex, 1);
            });
        },
        bulkDeleteAcmeAccountsFailed: (state, action: PayloadAction<string | undefined>) => {
            state.isDeleting = false
        },
        bulkEnableAcmeAccounts: (state, action: PayloadAction<string[]>) => {
            state.isFetchingDetail = true;
        },
        bulkEnableAcmeAccountsSuccess: (state, action: PayloadAction<string[]>) => {
            state.isFetchingDetail = false;
            action.payload.forEach(uuid => {
                const accountIndex = state.accounts.findIndex(account => account.uuid === uuid);
                if (accountIndex >= 0) state.accounts[accountIndex].enabled = true;
            });
        },
        bulkEnableAcmeAccountsFailed: (state, action: PayloadAction<string | undefined>) => {
            state.isFetchingDetail = false
        },
        bulkDisableAcmeAccounts: (state, action: PayloadAction<string[]>) => {
            state.isFetchingDetail = true;
        },
        bulkDisableAcmeAccountsSuccess: (state, action: PayloadAction<string[]>) => {
            state.isFetchingDetail = false;
            action.payload.forEach(uuid => {
                const accountIndex = state.accounts.findIndex(account => account.uuid === uuid);
                if (accountIndex >= 0) state.accounts[accountIndex].enabled = false;
            });
        },
        bulkDisableAcmeAccountsFailed: (state, action: PayloadAction<string | undefined>) => {
            state.isFetchingDetail = false
        }
    }
})

const state = createFeatureSelector<State>(slice.name);

const isFetching = createSelector(state, (state) => state.isFetchingList || state.isFetchingDetail);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const selectAccounts = createSelector(state, (state) => state.accounts);
const selectSelectedAccount = createSelector(state, (state) => state.account);
const selectConfirmDeleteAccountId = createSelector(state, (state) => state.confirmDeleteAccount);

export const selectors = {
    state,
    isDeleting,
    isFetching,
    selectAccounts,
    selectSelectedAccount,
    selectConfirmDeleteAccountId,
};

import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createFeatureSelector } from "utils/ducks";
import { AcmeAccountListModel, AcmeAccountModel } from "models/acme-accounts";
import { DeleteObjectErrorModel } from "models/deleteObjectErrorModel";


export type State = {

   checkedRows: string[];

   deleteErrorMessage: string;
   bulkDeleteErrorMessages: DeleteObjectErrorModel[];

   account?: AcmeAccountModel;
   accounts: AcmeAccountListModel[];

   isFetchingList: boolean;
   isFetchingDetail: boolean;
   isDeleting: boolean;
   isBulkDeleting: boolean;
   isEnabling: boolean;
   isBulkEnabling: boolean;
   isDisabling: boolean;
   isBulkDisabling: boolean;

};


export const initialState: State = {

   checkedRows: [],

   deleteErrorMessage: "",
   bulkDeleteErrorMessages: [],

   accounts: [],

   isFetchingList: false,
   isFetchingDetail: false,
   isDeleting: false,
   isBulkDeleting: false,
   isEnabling: false,
   isBulkEnabling: false,
   isDisabling: false,
   isBulkDisabling: false,


};


export const slice = createSlice({

   name: "acmeAccounts",

   initialState,

   reducers: {

      resetSate: (state, action: PayloadAction<void>) => {

         state = initialState;

      },



      setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {

         state.checkedRows = action.payload.checkedRows

      },


      clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {

         state.deleteErrorMessage = "";
         state.bulkDeleteErrorMessages = [];

      },


      listAcmeAccounts: (state, action: PayloadAction<void>) => {

         state.isFetchingList = true;

      },


      listAcmeAccountsSuccess: (state, action: PayloadAction<{ acmeAccounts: AcmeAccountListModel[] }>) => {

         state.accounts = action.payload.acmeAccounts;
         state.isFetchingList = false;

      },


      listAcmeAccountsFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingList = false;

      },


      getAcmeAccount: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isFetchingDetail = true;

      },


      getAcmeAccountSuccess: (state, action: PayloadAction<{ acmeAccount: AcmeAccountModel }>) => {

         state.account = action.payload.acmeAccount;
         state.isFetchingDetail = false;

      },


      getAcmeAccountFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingDetail = false

      },


      revokeAcmeAccount: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDeleting = true

      },


      revokeAcmeAccountSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDeleting = false;

         const accountIndex = state.accounts.findIndex(account => account.uuid === action.payload.uuid);
         if (accountIndex >= 0) state.accounts.splice(accountIndex, 1);

         if (state.account?.uuid === action.payload.uuid) state.account = undefined;

      },


      revokeAcmeAccountFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDeleting = false

      },


      enableAcmeAccount: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isEnabling = true;

      },


      enableAcmeAccountSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isEnabling = false;

         const account = state.accounts.find(account => account.uuid === action.payload.uuid);
         if (account) account.enabled = true;

         if (state.account?.uuid === action.payload.uuid) state.account.enabled = true;

      },


      enableAcmeAccountFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isEnabling = false

      },


      disableAcmeAccount: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDisabling = true;

      },


      disableAcmeAccountSuccess: (state, action: PayloadAction<{ uuid: string }>) => {

         state.isDisabling = false;

         const account = state.accounts.find(account => account.uuid === action.payload.uuid);
         if (account) account.enabled = false;

         if (state.account?.uuid === action.payload.uuid) state.account.enabled = false;

      },


      disableAcmeAccountFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingDetail = false

      },


      bulkRevokeAcmeAccounts: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDeleting = true

      },


      bulkRevokeAcmeAccountsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDeleting = false;

         action.payload.uuids.forEach(

            uuid => {

               const accountIndex = state.accounts.findIndex(account => account.uuid === uuid);
               if (accountIndex >= 0) state.accounts.splice(accountIndex, 1);

            }

         );

         if (state.account && action.payload.uuids.includes(state.account?.uuid)) state.account = undefined;


      },


      bulkRevokeAcmeAccountsFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDeleting = false;

      },


      bulkEnableAcmeAccounts: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = true;

      },


      bulkEnableAcmeAccountsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = false;

         action.payload.uuids.forEach(

            uuid => {
               const account = state.accounts.find(account => account.uuid === uuid);
               if (account) account.enabled = true;
            }

         );

         if (state.account && action.payload.uuids.includes(state.account?.uuid)) state.account.enabled = true;

      },


      bulkEnableAcmeAccountsFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkEnabling = false;

      },


      bulkDisableAcmeAccounts: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = true;

      },


      bulkDisableAcmeAccountsSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = false;

         action.payload.uuids.forEach(

            uuid => {
               const account = state.accounts.find(account => account.uuid === uuid);
               if (account) account.enabled = false;
            }

         );

         if (state.account && action.payload.uuids.includes(state.account?.uuid)) state.account.enabled = false;

      },


      bulkDisableAcmeAccountsFailed: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDisabling = false

      }

   }

})


const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, state => state.checkedRows);

const deleteErrorMessage = createSelector(state, state => state.deleteErrorMessage);
const bulkDeleteErrorMessages = createSelector(state, state => state.bulkDeleteErrorMessages);

const account = createSelector(state, state => state.account);
const accounts = createSelector(state, state => state.accounts);

const isFetchingList = createSelector(state, state => state.isFetchingList);
const isFetchingDetail = createSelector(state, state => state.isFetchingDetail);
const isDeleting = createSelector(state, state => state.isDeleting);
const isBulkDeleting = createSelector(state, state => state.isBulkDeleting);
const isEnabling = createSelector(state, state => state.isEnabling);
const isBulkEnabling = createSelector(state, state => state.isBulkEnabling);
const isDisabling = createSelector(state, state => state.isDisabling);
const isBulkDisabling = createSelector(state, state => state.isBulkDisabling);


export const selectors = {

   state,

   checkedRows,

   deleteErrorMessage,
   bulkDeleteErrorMessages,

   account,
   accounts,

   isFetchingList,
   isFetchingDetail,
   isDeleting,
   isBulkDeleting,
   isEnabling,
   isBulkEnabling,
   isDisabling,
   isBulkDisabling

};


export const actions = slice.actions;


export default slice.reducer;

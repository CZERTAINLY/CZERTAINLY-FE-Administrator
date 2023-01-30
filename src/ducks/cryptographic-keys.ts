import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
   CryptographicKeyAddRequestModel,
   CryptographicKeyDetailResponseModel,
   CryptographicKeyEditRequestModel,
   CryptographicKeyKeyUsageBulkUpdateRequestModel,
   CryptographicKeyKeyUsageUpdateRequestModel,
   CryptographicKeyResponseModel,
} from "types/cryptographic-keys";
import { BulkActionModel } from "types/connectors";
import { KeyState, KeyRequestType, KeyUsage } from "types/openapi";
import { AttributeDescriptorModel } from "types/attributes";

export type State = {

   checkedRows: string[];

   deleteErrorMessage: string;
   bulkDeleteErrorMessages: BulkActionModel[];

   keyAttributeDescriptors?: AttributeDescriptorModel[];

   cryptographicKey?: CryptographicKeyDetailResponseModel;
   cryptographicKeys: CryptographicKeyResponseModel[];

   isFetchingList: boolean;
   isFetchingDetail: boolean;
   isUpdatingKeyUsage: boolean;
   isBulkUpdatingKeyUsage: boolean;

   isCreating: boolean;
   isDeleting: boolean;
   isBulkDeleting: boolean;
   isUpdating: boolean;
   isEnabling: boolean;
   isBulkEnabling: boolean;
   isDisabling: boolean;
   isBulkDisabling: boolean;
   isCompromising: boolean;
   isBulkCompromising: boolean;
   isDestroying: boolean;
   isBulkDestroying: boolean;

   isFetchingAttributes: boolean;

};

export const initialState: State = {

   checkedRows: [],

   deleteErrorMessage: "",
   bulkDeleteErrorMessages: [],

   keyAttributeDescriptors: [],

   cryptographicKeys: [],

   isFetchingList: false,
   isFetchingDetail: false,
   isUpdatingKeyUsage: false,
   isBulkUpdatingKeyUsage: false,
   isCreating: false,
   isDeleting: false,
   isBulkDeleting: false,
   isUpdating: false,
   isEnabling: false,
   isDisabling: false,
   isBulkEnabling: false,
   isBulkDisabling: false,
   isCompromising: false,
   isBulkCompromising: false,
   isDestroying: false,
   isBulkDestroying: false,

   isFetchingAttributes: false,

};


export const slice = createSlice({

   name: "cryptographicKeys",

   initialState,

   reducers: {

      resetState: (state, action: PayloadAction<void>) => {

         Object.keys(state).forEach(
            key => { if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined; }
         );

         Object.keys(initialState).forEach(
            key => (state as any)[key] = (initialState as any)[key]
         );

      },


      setCheckedRows: (state, action: PayloadAction<{ checkedRows: string[] }>) => {

         state.checkedRows = action.payload.checkedRows;

      },


      clearDeleteErrorMessages: (state, action: PayloadAction<void>) => {

         state.deleteErrorMessage = "";
         state.bulkDeleteErrorMessages = [];

      },

      clearKeyAttributeDescriptors: (state, action: PayloadAction<void>) => {

         state.keyAttributeDescriptors = [];

      },


      listCryptographicKeys: (state, action: PayloadAction<void>) => {

         state.cryptographicKeys = [];
         state.isFetchingList = true;

      },


      listCryptographicKeysSuccess: (state, action: PayloadAction<{ cryptographicKeys: CryptographicKeyResponseModel[] }>) => {

         state.cryptographicKeys = action.payload.cryptographicKeys;
         state.isFetchingList = false;

      },


      listCryptographicKeysFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingList = false;

      },

      getCryptographicKeyDetail: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string }>) => {

         state.cryptographicKey = undefined;
         state.isFetchingDetail = true;

      },


      getCryptographicKeyDetailSuccess: (state, action: PayloadAction<{ cryptographicKey: CryptographicKeyDetailResponseModel }>) => {

         state.isFetchingDetail = false;
         state.cryptographicKey = action.payload.cryptographicKey;

      },


      getCryptographicKeyDetailFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingDetail = false;

      },


      createCryptographicKey: (state, action: PayloadAction<{
         tokenInstanceUuid: string,
         tokenProfileUuid: string,
         type: KeyRequestType,
         cryptographicKeyAddRequest: CryptographicKeyAddRequestModel
      }>) => {

         state.isCreating = true;

      },

      listAttributeDescriptors: (state, action: PayloadAction<{ tokenInstanceUuid: string, tokenProfileUuid: string, keyRequestType: KeyRequestType }>) => {

         state.isFetchingAttributes = true;

      },


      listAttributeDescriptorsSuccess: (state, action: PayloadAction<{ uuid: string, attributeDescriptors: AttributeDescriptorModel[] }>) => {

         state.isFetchingAttributes = false;

         state.keyAttributeDescriptors = action.payload.attributeDescriptors;

      },


      listAttributeDescriptorsFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isFetchingAttributes = false;

      },


      createCryptographicKeySuccess: (state, action: PayloadAction<{ uuid: string , tokenInstanceUuid: string}>) => {

         state.isCreating = false;

      },


      createCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isCreating = false;

      },


      updateCryptographicKey: (state, action: PayloadAction<{
         profileUuid: string,
         tokenInstanceUuid: string,
         cryptographicKeyEditRequest: CryptographicKeyEditRequestModel,
         redirect?: string
      }>) => {

         state.isUpdating = true;

      },


      updateCryptographicKeySuccess: (state, action: PayloadAction<{ cryptographicKey: CryptographicKeyDetailResponseModel, redirect?: string }>) => {

         state.isUpdating = false;
         state.cryptographicKey = action.payload.cryptographicKey;

      },


      updateCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdating = false;

      },


      enableCryptographicKey: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string, keyItemUuid: Array<string> }>) => {

         state.isEnabling = true;

      },


      enableCryptographicKeySuccess: (state, action: PayloadAction<{ uuid: string, keyItemUuid: Array<string> }>) => {

         state.isEnabling = false;
         
         if(action.payload.keyItemUuid.length > 0){
            action.payload.keyItemUuid.forEach((keyItemUuid) => {
               const keyItem = state.cryptographicKey?.items.find(keyItem => keyItem.uuid === keyItemUuid);
               if (keyItem) keyItem.enabled = true;
            });
         }
         else{
            state.cryptographicKey?.items.forEach((keyItem) => {
               keyItem.enabled = true;
            });
         }
      },


      enableCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isEnabling = false;

      },


      disableCryptographicKey: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string, keyItemUuid: Array<string> }>) => {

         state.isDisabling = true;

      },


      disableCryptographicKeySuccess: (state, action: PayloadAction<{ uuid: string, keyItemUuid: Array<string> }>) => {

         state.isDisabling = false;
         
         if(action.payload.keyItemUuid.length > 0){
            action.payload.keyItemUuid.forEach((keyItemUuid) => {
               const keyItem = state.cryptographicKey?.items.find(keyItem => keyItem.uuid === keyItemUuid);
               if (keyItem) keyItem.enabled = false;
            });
         }
         else{
            state.cryptographicKey?.items.forEach((keyItem) => {
               keyItem.enabled = false;
            });
         }
      },


      disableCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDisabling = false;

      },


      deleteCryptographicKey: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string, keyItemUuid: Array<string>, redirect?:string }>) => {

         state.isDeleting = true;

      },


      deleteCryptographicKeySuccess: (state, action: PayloadAction<{ uuid: string, keyItemUuid: Array<string>, redirect?: string }>) => {

         state.isDeleting = false;

         const index = state.cryptographicKeys.findIndex(cryptographicKey => cryptographicKey.uuid === action.payload.uuid);
         if(action.payload.keyItemUuid.length === state.cryptographicKey?.items.length) {
            if (index !== -1) state.cryptographicKeys.splice(index, 1);
            if (state.cryptographicKey?.uuid === action.payload.uuid) state.cryptographicKey = undefined;
         } else {
                  action.payload.keyItemUuid.map(keyUuid => 
                  {
                     const keyItem = state.cryptographicKey?.items.find(keyItem => keyItem.uuid === keyUuid);
                     if (keyItem) {
                        const keyItemIndex = state.cryptographicKey?.items.indexOf(keyItem);
                        if (keyItemIndex !== undefined && keyItemIndex !== -1) {
                           state.cryptographicKey?.items.splice(keyItemIndex, 1);
                        }                     }
                        return null;
                     }
               
               );
         }
      },


      deleteCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDeleting = false;

      },


      compromiseCryptographicKey: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string, keyItemUuid: Array<string> }>) => {

         state.isCompromising = true;

      },


      compromiseCryptographicKeySuccess: (state, action: PayloadAction<{ uuid: string, keyItemUuid: Array<string> }>) => {

         state.isCompromising = false;

         if(action.payload.keyItemUuid.length > 0){
            action.payload.keyItemUuid.forEach((keyItemUuid) => {
               const keyItem = state.cryptographicKey?.items.find(keyItem => keyItem.uuid === keyItemUuid);
               if (keyItem) keyItem.state = KeyState.Compromised;
            });
         }
         else{
               state.cryptographicKey?.items.forEach((keyItem) => {
                  keyItem.state = KeyState.Compromised;
               });
         }
      },


      compromiseCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isCompromising = false;
         
      },


      destroyCryptographicKey: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string, keyItemUuid: Array<string> }>) => {

         state.isDestroying = true;

      },


      destroyCryptographicKeySuccess: (state, action: PayloadAction<{ uuid: string, keyItemUuid: Array<string> }>) => {

         state.isDestroying = false;

         if(action.payload.keyItemUuid.length > 0){
            action.payload.keyItemUuid.forEach((keyItemUuid) => {
               const keyItem = state.cryptographicKey?.items.find(keyItem => keyItem.uuid === keyItemUuid);
               if (keyItem) keyItem.state = KeyState.Destroyed;
            });
         }
         else{
               state.cryptographicKey?.items.forEach((keyItem) => {
                  keyItem.state = KeyState.Destroyed;
               });
         }
      },


      destroyCryptographicKeyFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isDestroying = false;
         
      },


      bulkDeleteCryptographicKeys: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.bulkDeleteErrorMessages = [];
         state.isBulkDeleting = true;

      },


      bulkDeleteCryptographicKeysSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDeleting = false;

         action.payload.uuids.forEach(

            uuid => {
               const index = state.cryptographicKeys.findIndex(cryptographicKey => cryptographicKey.uuid === uuid);
               if (index >= 0) state.cryptographicKeys.splice(index, 1);
            }

         );

         if (state.cryptographicKey && action.payload.uuids.includes(state.cryptographicKey.uuid)) state.cryptographicKey = undefined;

      },


      bulkDeleteCryptographicKeysFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDeleting = false;

      },


      bulkEnableCryptographicKeys: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = true;

      },


      bulkEnableCryptographicKeysSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkEnabling = false;

      },


      bulkEnableCryptographicKeysFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isBulkEnabling = false;

      },


      bulkDisableCryptographicKeys: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = true;

      },


      bulkDisableCryptographicKeysSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDisabling = false;

      },


      bulkDisableCryptographicKeysFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkDisabling = false;

      },
      
      updateKeyUsage: (state, action: PayloadAction<{ tokenInstanceUuid: string, uuid: string, usage: CryptographicKeyKeyUsageUpdateRequestModel }>) => {

         state.isUpdatingKeyUsage = true;

      },


      updateKeyUsageSuccess: (state, action: PayloadAction<{ uuid: string, keyItemsUuid: Array<string>, usage: Array<KeyUsage> }>) => {

         state.isUpdatingKeyUsage = false;
         
         if(action.payload.keyItemsUuid && action.payload.keyItemsUuid.length > 0) {
            action.payload.keyItemsUuid.forEach(keyItemUuid => {
               const index = state.cryptographicKey!.items.findIndex(keyItem => keyItem.uuid === keyItemUuid);
               if (index >= 0) state.cryptographicKey!.items[index].usage = action.payload.usage;
            });
         } else {
            state.cryptographicKey?.items.forEach(keyItem => {
               keyItem.usage = action.payload.usage;
            });
         }
      },


      updateKeyUsageFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isUpdatingKeyUsage = false;

      },


      bulkUpdateKeyUsage: (state, action: PayloadAction<{ usage: CryptographicKeyKeyUsageBulkUpdateRequestModel }>) => {

         state.isBulkUpdatingKeyUsage = true;

      },


      bulkUpdateKeyUsageSuccess: (state, action: PayloadAction<{ }>) => {

         state.isBulkUpdatingKeyUsage = false;

      },


      bulkUpdateKeyUsageFailure: (state, action: PayloadAction<{ error: string | undefined }>) => {

         state.isBulkUpdatingKeyUsage = false;

      },


      bulkCompromiseCryptographicKeys: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkCompromising = true;

      },


      bulkCompromiseCryptographicKeysSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkCompromising = false;

      },


      bulkCompromiseCryptographicKeysFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isBulkCompromising = false;

      },


      bulkDestroyCryptographicKeys: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDestroying = true;

      },


      bulkDestroyCryptographicKeysSuccess: (state, action: PayloadAction<{ uuids: string[] }>) => {

         state.isBulkDestroying = false;

      },


      bulkDestroyCryptographicKeysFailure: (state, action: PayloadAction<{ error: string }>) => {

         state.isBulkDestroying = false;

      },
   }

});


const state = createFeatureSelector<State>(slice.name);

const checkedRows = createSelector(state, (state: State) => state.checkedRows);

const cryptographicKey = createSelector(state, (state: State) => state.cryptographicKey);
const cryptographicKeys = createSelector(state, (state: State) => state.cryptographicKeys);

const isFetchingList = createSelector(state, (state: State) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state: State) => state.isFetchingDetail);
const isCreating = createSelector(state, (state: State) => state.isCreating);
const isDeleting = createSelector(state, (state: State) => state.isDeleting);
const isBulkDeleting = createSelector(state, (state: State) => state.isBulkDeleting);
const isUpdating = createSelector(state, (state: State) => state.isUpdating);
const isEnabling = createSelector(state, (state: State) => state.isEnabling);
const isBulkEnabling = createSelector(state, (state: State) => state.isBulkEnabling);
const isDisabling = createSelector(state, (state: State) => state.isDisabling);
const isBulkDisabling = createSelector(state, (state: State) => state.isBulkDisabling);
const isCompromising = createSelector(state, (state: State) => state.isCompromising);
const isBulkCompromising = createSelector(state, (state: State) => state.isBulkCompromising);
const isDestroying = createSelector(state, (state: State) => state.isDestroying);
const isBulkDestroying = createSelector(state, (state: State) => state.isBulkDestroying);

const isUpdatingKeyUsage = createSelector(state, (state: State) => state.isUpdatingKeyUsage);
const isBulkUpdatingKeyUsage = createSelector(state, (state: State) => state.isBulkUpdatingKeyUsage);

const isFetchingAttributes = createSelector(state, (state: State) => state.isFetchingAttributes);
const keyAttributeDescriptors = createSelector(state, (state: State) => state.keyAttributeDescriptors);



export const selectors = {

   state,

   checkedRows,

   cryptographicKey,
   cryptographicKeys,

   isFetchingList,
   isFetchingDetail,
   isCreating,
   isDeleting,
   isBulkDeleting,
   isUpdating,
   isEnabling,
   isBulkEnabling,
   isDisabling,
   isBulkDisabling,
   isCompromising,
   isBulkCompromising,
   isDestroying,
   isBulkDestroying,

   isUpdatingKeyUsage,
   isBulkUpdatingKeyUsage,

   isFetchingAttributes,
   keyAttributeDescriptors,

};


export const actions = slice.actions;


export default slice.reducer;

import { AdministratorModel, AdministratorRole } from "models";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";


export type State = {

   checkedRows: string[];

   administrator?: AdministratorModel;
   administrators: AdministratorModel[];

   isCreating: boolean;
   isDeleting: boolean;
   isUpdating: boolean;
   isFetchingDetail: boolean;
   isFetchingList: boolean;
   isEnabling: boolean;
   isDisabling: boolean;
   isBulkDeleting: boolean;
   isBulkEnabling: boolean;
   isBulkDisabling: boolean;

};


export const initialState: State = {

   checkedRows: [],

   administrators: [],

   isCreating: false,
   isDeleting: false,
   isUpdating: false,
   isFetchingDetail: false,
   isFetchingList: false,
   isEnabling: false,
   isDisabling: false,
   isBulkDeleting: false,
   isBulkEnabling: false,
   isBulkDisabling: false
};


export const slice = createSlice({

   name: "administrators",

   initialState,

   reducers: {

      setCheckedRows: (state, action: PayloadAction<string[]>) => {

         state.checkedRows = action.payload;

      },


      listAdmins: (state, action: PayloadAction<void>) => {

         state.checkedRows = [];
         state.isFetchingList = true;

      },


      listAdminsSuccess: (state, action: PayloadAction<AdministratorModel[]>) => {

         state.isFetchingList = false;
         state.administrators = action.payload;

      },


      listAdminFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingList = false;
      },


      getAdminDetail: (state, action: PayloadAction<string>) => {

         state.administrator = undefined;
         state.isFetchingDetail = true;

      },


      getAdminDetailSuccess: (state, action: PayloadAction<AdministratorModel>) => {

         state.isFetchingDetail = false;
         state.administrator = action.payload;

         const index = state.administrators.findIndex(administrator => administrator.uuid === action.payload.uuid);

         if (index >= 0) {
            state.administrators[index] = action.payload;
         } else {
            state.administrators.push(action.payload);
         }

      },


      getAdminDetailFailure: (state, acttion: PayloadAction<string | undefined>) => {

         state.isFetchingDetail = false;

      },


      createAdmin: (state, action: PayloadAction<{
         name: string,
         surname: string,
         username: string,
         email: string,
         description: string,
         role: AdministratorRole,
         certificate: FileList | undefined,
         certificateUuid: string | undefined
      }>) => {

         state.isCreating = true;

      },


      createAdminSuccess: (state, action: PayloadAction<string>) => {

         state.isCreating = false;
         // !!! as no full admin object is not retuned from the server is is not possible to add/replace it in the list !!!

      },


      createAdminFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isCreating = false;

      },


      updateAdmin: (state, action: PayloadAction<{
         uuid: string,
         name: string,
         surname: string,
         username: string,
         email: string,
         certificate: FileList | undefined,
         description: string,
         role: AdministratorRole,
         certificateUuid: string | undefined
      }>) => {

         state.isUpdating = true;

      },


      updateAdminSuccess: (state, action: PayloadAction<AdministratorModel>) => {

         state.isUpdating = false;

         const adminIndex = state.administrators.findIndex(administrator => administrator.uuid === action.payload.uuid)

         if (adminIndex >= 0) {
            state.administrators[adminIndex] = action.payload;
         } else {
            state.administrators.push(action.payload);
         }

         if (state.administrator?.uuid === action.payload.uuid) state.administrator = action.payload;

      },


      updateAdminFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isUpdating = false;

      },


      deleteAdmin: (state, action: PayloadAction<string>) => {

         state.isDeleting = true;

      },


      deleteAdminSuccess: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;
         state.checkedRows = [];

         const adminIndex = state.administrators.findIndex(administrator => administrator.uuid === action.payload);
         if (adminIndex >= 0) state.administrators.splice(adminIndex, 1);

         if (state.administrator?.uuid === action.payload) state.administrator = undefined;

      },


      deleteAdminFailure: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;

      },


      bulkDeleteAdmins: (state, action: PayloadAction<string[]>) => {

         state.isBulkDeleting = true;

      },


      bulkDeleteAdminsSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkDeleting = false;
         state.checkedRows = [];

         action.payload.forEach(
            uuid => {

               const adminIndex = state.administrators.findIndex(administrator => administrator.uuid === uuid)
               if (adminIndex >= 0) state.administrators.splice(adminIndex, 1);

               if (state.administrator?.uuid === uuid) state.administrator = undefined;

            }
         )

      },


      bulkDeleteAdminsFailure: (state, action: PayloadAction<string>) => {

         state.isBulkDeleting = false;

      },


      enableAdmin: (state, action: PayloadAction<string>) => {

         state.isEnabling = true;

      },


      enableAdminSuccess: (state, action: PayloadAction<string>) => {

         state.isEnabling = false;

         const admin = state.administrators.find(administrator => administrator.uuid === action.payload)
         if (admin) admin.enabled = true;

         if (state.administrator?.uuid === action.payload) state.administrator.enabled = true;

      },


      enableAdminFailure: (state, action: PayloadAction<string>) => {

         state.isEnabling = false;

      },


      bulkEnableAdmins: (state, action: PayloadAction<string[]>) => {

         state.isBulkEnabling = true;

      },


      bulkEnableAdminsSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkEnabling = false;

         action.payload.forEach(
            uuid => {
               const admin = state.administrators.find(administrator => administrator.uuid === uuid)
               if (admin) admin.enabled = true;
               if (state.administrator?.uuid === uuid) state.administrator.enabled = true;
            }
         )

      },


      bulkEnableAdminsFailure: (state, action: PayloadAction<string>) => {

         state.isBulkEnabling = false;

      },


      disableAdmin: (state, action: PayloadAction<string>) => {

         state.isDisabling = true;

      },


      disableAdminSuccess: (state, action: PayloadAction<string>) => {

         state.isDisabling = false;

         const admin = state.administrators.find(administrator => administrator.uuid === action.payload)
         if (admin) admin.enabled = false;
         if (state.administrator?.uuid === action.payload) state.administrator.enabled = false;


      },


      disableAdminFailure: (state, action: PayloadAction<string>) => {

         state.isDisabling = false;

      },


      bulkDisableAdmins: (state, action: PayloadAction<string[]>) => {

         state.isBulkDisabling = true;

      },


      bulkDisableAdminsSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkDisabling = false;

         action.payload.forEach(
            uuid => {
               const admin = state.administrators.find(administrator => administrator.uuid === uuid)
               if (admin) admin.enabled = false;
               if (state.administrator?.uuid === uuid) state.administrator.enabled = false;
            }
         )

      },


      bulkDisableAdminsFailure: (state, action: PayloadAction<string>) => {

         state.isBulkDisabling = false;

      },
   }

})


const state = createFeatureSelector<State>(slice.name);

const administrators = createSelector(state, state => state.administrators);
const administrator = createSelector(state, state => state.administrator);

const checkedRows = createSelector(state, state => state.checkedRows);

const isFetchingList = createSelector(state, state => state.isFetchingList);
const isFetchingDetail = createSelector(state, state => state.isFetchingDetail);
const isCreating = createSelector(state, state => state.isCreating);
const isUpdating = createSelector(state, state => state.isUpdating);
const isDeleting = createSelector(state, state => state.isDeleting);
const isEnabling = createSelector(state, state => state.isEnabling);
const isDisabling = createSelector(state, state => state.isDisabling);
const isBulkDeleting = createSelector(state, state => state.isBulkDeleting);
const isBulkEnabling = createSelector(state, state => state.isBulkEnabling);
const isBulkDisabling = createSelector(state, state => state.isBulkDisabling);


export const selectors = {
   state,
   isFetchingList,
   isFetchingDetail,
   isCreating,
   isDeleting,
   isUpdating,
   isEnabling,
   isDisabling,
   isBulkDeleting,
   isBulkEnabling,
   isBulkDisabling,
   checkedRows: checkedRows,
   administrators: administrators,
   admininistrator: administrator
};

export const actions = slice.actions;

export default slice.reducer;

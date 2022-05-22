import { AdministratorModel, AdministratorRole } from "models";
import { createFeatureSelector } from "utils/ducks";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";


export const statePath = "administrators";


export type State = {

   administrators: AdministratorModel[];
   administratorDetail?: AdministratorModel;

   checkedRows: string[];
   isCreating: boolean;
   isDeleting: boolean;
   isUpdating: boolean;
   isFetchingDetail: boolean;
   isFetchingList: boolean;
   isEnabling: boolean;
   isDisabing: boolean;
   isBulkDeleting: boolean;
   isBulkEnabling: boolean;
   isBulkDisabling: boolean;

};


export const initialState: State = {

   administrators: [],
   checkedRows: [],

   isCreating: false,
   isDeleting: false,
   isUpdating: false,
   isFetchingDetail: false,
   isFetchingList: false,
   isEnabling: false,
   isDisabing: false,
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

         state.isFetchingList = true;

      },


      listAdminsSuccess: (state, action: PayloadAction<AdministratorModel[]>) => {

         state.isFetchingList = false;
         state.checkedRows = [];
         state.administrators = action.payload;

      },


      listAdminFailure: (state, action: PayloadAction<string | undefined>) => {

         state.isFetchingList = false;
         state.checkedRows = [];

      },


      getAdminDetail: (state, action: PayloadAction<string>) => {

         state.administratorDetail = undefined;
         state.isFetchingDetail = true;

      },


      getAdminDetailSuccess: (state, action: PayloadAction<AdministratorModel>) => {

         state.isFetchingDetail = false;
         state.administratorDetail = action.payload;

      },


      getAdminDetailFailure: (state, acttion: PayloadAction<string | undefined>) => {

         state.isFetchingDetail = false;

      },


      createAdmin: (state, action: PayloadAction<{
         name: string,
         surname: string,
         username: string,
         email: string,
         certificate: FileList | undefined,
         description: string,
         role: AdministratorRole,
         certificateUuid: string | undefined
      }>) => {

         state.isCreating = true;

      },


      createAdminSuccess: (state, action: PayloadAction<string>) => {

         state.isCreating = false;

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
         if (state.administratorDetail?.uuid === action.payload) state.administratorDetail = undefined;

      },


      deleteAdminFailure: (state, action: PayloadAction<string>) => {

         state.isDeleting = false;

      },


      bulkDeleteAdmin: (state, action: PayloadAction<string[]>) => {

         state.isBulkDeleting = true;

      },


      bulkDeleteAdminSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkDeleting = false;
         state.checkedRows = [];

         action.payload.forEach(
            uuid => {
               const adminIndex = state.administrators.findIndex(administrator => administrator.uuid === uuid)
               if (adminIndex >= 0) state.administrators.splice(adminIndex, 1);
               if (state.administratorDetail?.uuid === uuid) state.administratorDetail = undefined;
            }
         )

      },


      bulkDeleteAdminFailure: (state, action: PayloadAction<string>) => {

         state.isBulkDeleting = false;

      },


      enableAdmin: (state, action: PayloadAction<string>) => {

         state.isEnabling = true;

      },


      enableAdminSuccess: (state, action: PayloadAction<string>) => {

         state.isEnabling = false;

         const admin = state.administrators.find(administrator => administrator.uuid === action.payload)
         if (admin) admin.enabled = true;
         if (state.administratorDetail?.uuid === action.payload) state.administratorDetail.enabled = true;

      },


      enableAdminFailure: (state, action: PayloadAction<string>) => {

         state.isEnabling = false;

      },


      bulkEnableAdmin: (state, action: PayloadAction<string[]>) => {

         state.isBulkEnabling = true;

      },


      bulkEnableAdminSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkEnabling = false;

         action.payload.forEach(
            uuid => {
               const admin = state.administrators.find(administrator => administrator.uuid === uuid)
               if (admin) admin.enabled = true;
               if (state.administratorDetail?.uuid === uuid) state.administratorDetail.enabled = true;
            }
         )

      },


      bulkEnableAdminFailure: (state, action: PayloadAction<string>) => {

         state.isBulkEnabling = false;

      },


      disableAdmin: (state, action: PayloadAction<string>) => {

         state.isDisabing = true;

      },


      disableAdminSuccess: (state, action: PayloadAction<string>) => {

         state.isDisabing = false;

         const admin = state.administrators.find(administrator => administrator.uuid === action.payload)
         if (admin) admin.enabled = false;
         if (state.administratorDetail?.uuid === action.payload) state.administratorDetail.enabled = false;


      },


      disableAdminFailure: (state, action: PayloadAction<string>) => {

         state.isDisabing = false;

      },


      bulkDisableAdmin: (state, action: PayloadAction<string[]>) => {

         state.isBulkDisabling = true;

      },


      bulkDisableAdminSuccess: (state, action: PayloadAction<string[]>) => {

         state.isBulkDisabling = false;

         action.payload.forEach(
            uuid => {
               const admin = state.administrators.find(administrator => administrator.uuid === uuid)
               if (admin) admin.enabled = false;
               if (state.administratorDetail?.uuid === uuid) state.administratorDetail.enabled = false;
            }
         )

      },


      bulkDisableAdminFailure: (state, action: PayloadAction<string>) => {

         state.isBulkDisabling = false;

      },
   }

})

const state = createFeatureSelector<State>(statePath);

const isFetchingList = createSelector(state, (state) => state.isFetchingList);
const isFetchingDetail = createSelector(state, (state) => state.isFetchingDetail);
const isCreating = createSelector(state, (state) => state.isCreating);
const isDeleting = createSelector(state, (state) => state.isDeleting);
const isUpdating = createSelector(state, (state) => state.isUpdating);
const isEnabling = createSelector(state, (state) => state.isEnabling);
const isDisabing = createSelector(state, (state) => state.isDisabing);
const isBulkDeleting = createSelector(state, (state) => state.isBulkDeleting);
const isBulkEnabling = createSelector(state, (state) => state.isBulkEnabling);
const isBulkDisabling = createSelector(state, (state) => state.isBulkDisabling);
const checkedRows = createSelector(state, (state) => state.checkedRows);

const administrators = createSelector(state, (state) => state.administrators);
const administrator = createSelector(state, (state) => state.administratorDetail);

export const selectors = {
   state,
   isFetchingList,
   isFetchingDetail,
   isCreating,
   isDeleting,
   isUpdating,
   isEnabling,
   isDisabing,
   isBulkDeleting,
   isBulkEnabling,
   isBulkDisabling,
   selectCheckedRows: checkedRows,
   selectAdministrators: administrators,
   admininistrator: administrator
};

export const actions = slice.actions;

export default slice.reducer;

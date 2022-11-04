import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { createFeatureSelector } from 'utils/ducks';
import { DashboardModal } from 'models/dashboard';


export type State = {
   isFetching: boolean;
   dashboard?: DashboardModal;
};


export const initialState: State = {
   isFetching: false,
   dashboard: undefined
};


export const slice = createSlice({

   name: "dashboard",

   initialState,

   reducers: {

      getDashboard: (state, action: PayloadAction<void>) => {

         state.isFetching = true;
         state.dashboard = undefined;

      },


      getDashboardSuccess: (state, action: PayloadAction<{ dashboard: DashboardModal }>) => {

         state.isFetching = false;
         state.dashboard = action.payload.dashboard;

      },


      getDashboardFailed: (state, action: PayloadAction<void>) => {

         state.isFetching = false;

      },
   }

});


const selectState = createFeatureSelector<State>(slice.name);

const dashboard = createSelector(selectState, state => state.dashboard);

const isFetching = createSelector(selectState, state => state.isFetching);


export const selectors = {
   selectState,
   dashboard,
   isFetching
};


export const actions = slice.actions;


export default slice.reducer;

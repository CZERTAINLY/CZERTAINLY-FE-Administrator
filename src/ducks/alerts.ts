import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageModel } from "models";
import { createFeatureSelector } from "utils/ducks";
import { createSelector } from 'reselect';
import { store } from "../index"


export type State = {
   messages: MessageModel[];
   msgId: number;
};


export const initialState: State = {
   messages: [],
   msgId: 0,
};


export const slice = createSlice({

   name: "alerts",

   initialState,

   reducers: {

      error: {

         prepare: (message: string) => ({ payload: message }),

         reducer: (state, action: PayloadAction<string>) => {

            state.messages.push({
               id: state.msgId,
               time: Date.now(),
               message: action.payload,
               color: "danger"
            })
            state.msgId++;

         }

      },


      success: {

         prepare: (message: string) => ({ payload: message }),

         reducer: (state, action: PayloadAction<string>) => {

            state.messages.push({
               id: state.msgId,
               time: Date.now(),
               message: action.payload,
               color: "success"
            })
            state.msgId++;

         }

      },


      hide: {

         prepare: (id: number) => ({ payload: id }),

         reducer: (state, action: PayloadAction<number>) => {
            const msgIndex = state.messages.findIndex(message => message.id === action.payload);
            if (msgIndex < 0) return;
            state.messages[msgIndex].isHiding = true;
         }


      },


      dismiss: {

         prepare: (messageId: number) => ({ payload: messageId }),

         reducer: (state, action: PayloadAction<number>) => {

            const messageIndex = state.messages.findIndex(message => message.id === action.payload);
            if (messageIndex === -1) return;

            state.messages.splice(messageIndex, 1);

         }
      }

   }
})

const selectState = createFeatureSelector<State>(slice.name);

const selectMessages = createSelector(selectState, state => state.messages);


export const selectors = {
   selectState,
   selectMessages
}


export const actions = slice.actions;


setInterval(

   () => {
      const alerts = store.getState().alerts;
      alerts.messages.forEach(
         message => {

            if (Date.now() - message.time > 7000) {
               store.dispatch(actions.hide(message.id));
            }

            if (Date.now() - message.time > 10000) {
               store.dispatch(actions.dismiss(message.id));
            }

         }
      )
   },1000

);


export default slice.reducer;
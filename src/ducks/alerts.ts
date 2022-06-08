import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageModel } from "models";
import { createFeatureSelector } from "utils/ducks";
import { createSelector } from 'reselect';


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
               message: action.payload,
               color: "success"
            })
            state.msgId++;

         }

      },


      dismiss: {

         /**
          * Returns an dispatchable action to remove message from the alert queue
          * @param messageId Id of the message to be removed from the queue
          * @returns
          */
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


export default slice.reducer;
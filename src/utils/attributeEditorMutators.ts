import { MutableState, Tools } from "final-form";

export function mutators<T>() {

   return {

      setAttribute: (args: any[], state: MutableState<T>, tools: Tools<T>) => {

         const key = args[0];
         const value = args[1];

         tools.changeValue(state, key, (prev: any) => value);

      },

      clearAttributes: (args: any[], state: MutableState<T>, tools: Tools<T>) => {
      }

   }

}




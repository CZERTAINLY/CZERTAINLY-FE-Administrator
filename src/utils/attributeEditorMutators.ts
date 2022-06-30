import { fieldSubscriptionItems, MutableState, Tools } from "final-form";

export function mutators<T>() {

   return {

      setAttribute: (args: any[], state: MutableState<T>, tools: Tools<T>) => {

         const key = args[0];
         const value = args[1];

         tools.changeValue(state, key, (prev: any) => value);

      },

      clearAttributes: (args: any[], state: MutableState<T>, tools: Tools<T>) => {

         const attributes = Object.keys(state.fields).filter(k => k.startsWith("__attribute__"))

         attributes.forEach(
            attribute => {
               tools.setIn(state, `fields.${attribute}`, undefined);
               tools.setIn(state, `formState.initialValues.${attribute}`, undefined);
            }
         );

      }

   }

}




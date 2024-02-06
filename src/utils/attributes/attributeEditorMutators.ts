import { MutableState, Tools } from 'final-form';

export function mutators<T>() {
    return {
        setAttribute: (args: any[], state: MutableState<T>, tools: Tools<T>) => {
            const key = args[0];
            const value = args[1];

            tools.changeValue(state, key, (prev: any) => value);
        },

        clearAttributes: (args: any[], state: MutableState<T>, tools: Tools<T>) => {
            let attributes;
            const id = args[0];

            /*attributes = Object.keys(state.fields).filter(k => k.startsWith("__attributes__"))
         attributes.forEach(attribute => delete state.fields[attribute]);
         attributes.forEach(attribute => delete state.fieldSubscribers[attribute]);

         attributes = Object.keys(state.formState.initialValues || {}).filter(k => k.startsWith("__attributes__"))
         attributes.forEach(attribute => tools.setIn(state, `formState.initialValues.${attribute}`, undefined));*/

            attributes = Object.keys(state.formState.values || {}).filter((k) => k.startsWith(`__attributes__${id ? id : ''}`));
            attributes.forEach((attribute) => ((state.formState.values as any)[attribute] = undefined));
        },
    };
}

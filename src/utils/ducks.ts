import { createSelector } from "@reduxjs/toolkit";


export function createFeatureSelector<T>(featureName: string): (state: any) => T {

   return createSelector(
      (state: any) => state[featureName],
      (featureState) => featureState
   );

}


export function definedOnly<T>(x: T | undefined): x is T {

   return x !== undefined;

}


export function arrayReducer<T extends { uuid: string }>(
   original: T[],
   uuid: string,
   reducer: (item: T) => T | null
): T[] {

   const arr = [...original];
   const idx = arr.findIndex((it) => it.uuid === uuid);
   if (idx < 0) {
      return original;
   }

   const newItem = reducer(original[idx]);
   if (newItem) {
      arr.splice(idx, 1, newItem);
   } else {
      arr.splice(idx, 1);
   }

   return arr;

}

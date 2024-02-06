import { createSelector } from '@reduxjs/toolkit';

export function createFeatureSelector<T>(featureName: string): (state: any) => T {
    return createSelector(
        (state: any) => state[featureName],
        (featureState) => featureState,
    );
}

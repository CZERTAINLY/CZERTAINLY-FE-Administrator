import React, { useCallback } from 'react';

export const useInputValue = <T extends { value: string }>(callback: (value: string) => void) => useCallback(
  (event: React.ChangeEvent<T>) => callback(event.target.value),
  [callback],
);

export const useChecked = <T extends { checked: boolean }>(callback: (value: boolean) => void) => useCallback(
  (event: React.ChangeEvent<T>) => callback(event.target.checked),
  [callback],
);

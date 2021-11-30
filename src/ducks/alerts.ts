import { createSelector } from 'reselect';
import { ActionType, createCustomAction, getType } from 'typesafe-actions';

import { Message } from 'models';
import { createFeatureSelector } from 'utils/ducks';

export const statePath = 'alerts';

export enum Actions {
  Dismiss = '@@alerts/DISMISS',
}

export const actions = {
  dismissAlert: createCustomAction(Actions.Dismiss, (id: number) => ({ id })),
};

export type AlertAction = ActionType<typeof actions>;

interface Action {
  type: string;
  isAlert?: boolean;
}

interface MessageAction extends Action {
  isAlert: true;
  message: string;
  color?: string;
}

interface DismissAction extends Action {
  type: Actions.Dismiss,
  id: number;
}

export type State = {
  messages: Message[];
  msgId: number;
};

export const initialState: State = {
  messages: [],
  msgId: 0,
};

export function createErrorAlertAction(error: string | undefined, rest?: any) {
  return { isAlert: !!error, message: error, color: 'danger', ...(rest || {}) };
}

export function createSuccessAlertAction(message: string, rest?: any) {
  return { isAlert: true, message, color: 'success', ...(rest || {}) };
}

export function reducer(state: State = initialState, action: Action): State {
  if (action.isAlert) {
    const { message, color } = action as MessageAction;
    
    return {
      ...state,
      msgId: state.msgId + 1,
      messages: [...state.messages, {
        id: state.msgId,
        message,
        color: color || 'success',
      }],
    };
  } else if (action.type === getType(actions.dismissAlert)) {
    const { id } = action as DismissAction;
    const msgIdx = state.messages.findIndex(msg => msg.id === id);
    if (msgIdx >= 0) {
      const messages = [...state.messages];
      messages.splice(msgIdx, 1);

      return {
        ...state,
        messages,
      };
    }
  }

  return state;
}

const selectState = createFeatureSelector<State>(statePath);

const selectMessages = createSelector(
  selectState,
  state => state.messages.reverse(),
);

export const selectors = {
  selectState,
  selectMessages,
};

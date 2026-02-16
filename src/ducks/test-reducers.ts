import { combineReducers, type UnknownAction } from '@reduxjs/toolkit';

// IMPORTANT: This file is used ONLY in component tests (Playwright CT).
// It must NOT import the real duck modules

export type UserInterfaceTestState = {
    widgetLocks: any[];
    globalModal: {
        title?: string;
        size: 'sm' | 'md' | 'lg';
        content?: unknown;
        isOpen: boolean;
        showCancelButton: boolean;
        showOkButton: boolean;
        showCloseButton: boolean;
        showSubmitButton: boolean;
        okButtonCallback?: () => void;
        cancelButtonCallback?: () => void;
    };
};

const userInterfaceTestInitialState: UserInterfaceTestState = {
    widgetLocks: [],
    globalModal: {
        title: undefined,
        size: 'sm',
        content: undefined,
        isOpen: false,
        showCancelButton: false,
        showOkButton: false,
        showCloseButton: false,
        showSubmitButton: false,
        okButtonCallback: undefined,
        cancelButtonCallback: undefined,
    },
};

function userInterfaceTestReducer(
    state: UserInterfaceTestState = userInterfaceTestInitialState,
    _action: UnknownAction,
): UserInterfaceTestState {
    return state;
}

export type EnumsTestState = {
    platformEnums: Record<string, any>;
};

const enumsTestInitialState: EnumsTestState = {
    platformEnums: {},
};

function enumsTestReducer(state: EnumsTestState = enumsTestInitialState, _action: UnknownAction): EnumsTestState {
    return state;
}

export type InfoTestState = {
    platformInfo?: any;
    isFetching: boolean;
};

const infoTestInitialState: InfoTestState = {
    platformInfo: undefined,
    isFetching: false,
};

function infoTestReducer(state: InfoTestState = infoTestInitialState, action: UnknownAction): InfoTestState {
    switch (action.type) {
        case 'info/getPlatformInfo':
            return { platformInfo: undefined, isFetching: true };
        case 'info/getPlatformInfoSuccess':
            return { platformInfo: action.payload, isFetching: false };
        case 'info/getPlatformInfoFailure':
            return { ...state, isFetching: false };
        default:
            return state;
    }
}

export type NotificationsTestState = {
    overviewNotifications: any[];
    isFetchingOverview: boolean;
};

const notificationsTestInitialState: NotificationsTestState = {
    overviewNotifications: [],
    isFetchingOverview: false,
};

function notificationsTestReducer(
    state: NotificationsTestState = notificationsTestInitialState,
    _action: UnknownAction,
): NotificationsTestState {
    return state;
}

export type AuthTestState = {
    profile?: {
        username: string;
        permissions?: {
            allowedListings?: any[];
        };
    };
};

const authTestInitialState: AuthTestState = {
    profile: {
        username: 'Test User',
        permissions: {
            allowedListings: [],
        },
    },
};

function authTestReducer(state: AuthTestState = authTestInitialState, _action: UnknownAction): AuthTestState {
    return state;
}

export const testReducers = combineReducers({
    userInterface: userInterfaceTestReducer,
    enums: enumsTestReducer,
    info: infoTestReducer,
    notifications: notificationsTestReducer,
    auth: authTestReducer,
});

export const testInitialState = {
    userInterface: userInterfaceTestInitialState,
    enums: enumsTestInitialState,
    info: infoTestInitialState,
    notifications: notificationsTestInitialState,
    auth: authTestInitialState,
};

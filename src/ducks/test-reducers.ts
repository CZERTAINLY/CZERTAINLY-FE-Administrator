import { combineReducers, type UnknownAction } from '@reduxjs/toolkit';

// IMPORTANT: This file is used ONLY in component tests (Playwright CT).
// It must NOT import the real duck modules

export type ReactFlowUITest = {
    flowChartNodes: Array<{ id: string; parentId?: string; hidden?: boolean; position?: { x: number; y: number } }>;
    flowChartEdges: any[];
    expandedHiddenNodeId?: string;
};

export type UserInterfaceTestState = {
    widgetLocks: any[];
    globalModal: {
        title?: string;
        size: 'sm' | 'md' | 'lg' | 'xl';
        content?: unknown;
        isOpen: boolean;
        showCancelButton: boolean;
        showOkButton: boolean;
        showCloseButton: boolean;
        showSubmitButton: boolean;
        okButtonCallback?: () => void;
        cancelButtonCallback?: () => void;
    };
    initiateAttributeCallback?: boolean;
    attributeCallbackValue?: string;
    reactFlowUI?: ReactFlowUITest;
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
    initiateAttributeCallback: undefined,
    attributeCallbackValue: undefined,
    reactFlowUI: {
        flowChartNodes: [],
        flowChartEdges: [],
        expandedHiddenNodeId: undefined,
    },
};

function userInterfaceTestReducer(
    state: UserInterfaceTestState = userInterfaceTestInitialState,
    action: UnknownAction,
): UserInterfaceTestState {
    const a = action as { type: string; payload?: any };
    if (a.type === 'userInterface/showGlobalModal' && a.payload) {
        return { ...state, globalModal: a.payload };
    }
    if (a.type === 'userInterface/resetState') {
        return { ...userInterfaceTestInitialState };
    }
    if (a.type === 'userInterface/setInitiateAttributeCallback') {
        return { ...state, initiateAttributeCallback: a.payload };
    }
    if (a.type === 'userInterface/setAttributeCallbackValue') {
        return { ...state, attributeCallbackValue: a.payload };
    }
    if (a.type === 'userInterface/clearAttributeCallbackValue') {
        return { ...state, attributeCallbackValue: undefined };
    }
    if (a.type === 'userInterface/updateReactFlowNodes' && a.payload && state.reactFlowUI) {
        return { ...state, reactFlowUI: { ...state.reactFlowUI, flowChartNodes: a.payload } };
    }
    if (a.type === 'userInterface/updateReactFlowEdges' && a.payload && state.reactFlowUI) {
        return { ...state, reactFlowUI: { ...state.reactFlowUI, flowChartEdges: a.payload } };
    }
    if (a.type === 'userInterface/setReactFlowUI') {
        return { ...state, reactFlowUI: a.payload };
    }
    if (a.type === 'userInterface/clearReactFlowUI') {
        return { ...state, reactFlowUI: undefined };
    }
    if (a.type === 'userInterface/setShowHiddenNodes') {
        const reactFlowUI = state.reactFlowUI
            ? { ...state.reactFlowUI, expandedHiddenNodeId: a.payload }
            : { flowChartNodes: [], flowChartEdges: [], expandedHiddenNodeId: a.payload };
        return { ...state, reactFlowUI };
    }
    if (a.type === 'userInterface/deleteNode' && a.payload && state.reactFlowUI) {
        const flowChartNodes = state.reactFlowUI.flowChartNodes.filter((node) => node.id !== a.payload);
        return { ...state, reactFlowUI: { ...state.reactFlowUI, flowChartNodes } };
    }
    return state;
}

export type EnumsTestState = {
    platformEnums: Record<string, Record<string, { label?: string; value?: string }>>;
};

const enumsTestInitialState: EnumsTestState = {
    platformEnums: {},
};

export type FiltersTestState = {
    filters: Array<{
        entity: number;
        filter: {
            availableFilters: any[];
            currentFilters: any[];
            preservedFilters: any[];
            isFetchingFilters: boolean;
        };
    }>;
};

const filtersTestInitialState: FiltersTestState = {
    filters: [],
};

function filtersTestReducer(state: FiltersTestState = filtersTestInitialState, action: UnknownAction): FiltersTestState {
    const a = action as { type: string; payload?: any };
    if (a.type === 'filters/getAvailableFilters') {
        return state;
    }
    if (a.type === 'filters/getAvailableFiltersSuccess' && a.payload) {
        const idx = state.filters.findIndex((f) => f.entity === a.payload.entity);
        const filter =
            idx >= 0
                ? state.filters[idx].filter
                : { availableFilters: [], currentFilters: [], preservedFilters: [], isFetchingFilters: false };
        const next = {
            entity: a.payload.entity,
            filter: { ...filter, availableFilters: a.payload.availableFilters ?? [], isFetchingFilters: false },
        };
        if (idx >= 0) {
            return {
                filters: state.filters.slice(0, idx).concat([next], state.filters.slice(idx + 1)),
            };
        }
        return { filters: [...state.filters, next] };
    }
    if (a.type === 'filters/getAvailableFiltersFailure' && a.payload) {
        const idx = state.filters.findIndex((f) => f.entity === a.payload.entity);
        if (idx < 0) return state;
        const f = state.filters[idx];
        return {
            filters: state.filters
                .slice(0, idx)
                .concat([{ ...f, filter: { ...f.filter, isFetchingFilters: false } }], state.filters.slice(idx + 1)),
        };
    }
    if (a.type === 'filters/setCurrentFilters' && a.payload) {
        const idx = state.filters.findIndex((f) => f.entity === a.payload.entity);
        const filter =
            idx >= 0
                ? state.filters[idx].filter
                : { availableFilters: [], currentFilters: [], preservedFilters: [], isFetchingFilters: false };
        const next = { entity: a.payload.entity, filter: { ...filter, currentFilters: a.payload.currentFilters ?? [] } };
        if (idx >= 0) {
            return {
                filters: state.filters.slice(0, idx).concat([next], state.filters.slice(idx + 1)),
            };
        }
        return { filters: [...state.filters, next] };
    }
    if (a.type === 'filters/setPreservedFilters' && a.payload) {
        const idx = state.filters.findIndex((f) => f.entity === a.payload.entity);
        const filter =
            idx >= 0
                ? state.filters[idx].filter
                : { availableFilters: [], currentFilters: [], preservedFilters: [], isFetchingFilters: false };
        const next = { entity: a.payload.entity, filter: { ...filter, preservedFilters: a.payload.preservedFilters ?? [] } };
        if (idx >= 0) {
            return {
                filters: state.filters.slice(0, idx).concat([next], state.filters.slice(idx + 1)),
            };
        }
        return { filters: [...state.filters, next] };
    }
    return state;
}

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

export type CustomAttributesTestState = {
    resourceCustomAttributes: any[];
    resourceCustomAttributesContents: Array<{ resource: string; resourceUuid: string; customAttributes: any[] }>;
    isFetchingResourceCustomAttributes: boolean;
    isUpdatingContent: boolean;
};

const customAttributesTestInitialState: CustomAttributesTestState = {
    resourceCustomAttributes: [],
    resourceCustomAttributesContents: [],
    isFetchingResourceCustomAttributes: false,
    isUpdatingContent: false,
};

function customAttributesTestReducer(
    state: CustomAttributesTestState = customAttributesTestInitialState,
    action: UnknownAction,
): CustomAttributesTestState {
    const a = action as { type: string; payload?: any };
    switch (a.type) {
        case 'customAttributes/listResourceCustomAttributes':
            return { ...state, isFetchingResourceCustomAttributes: true };
        case 'customAttributes/listResourceCustomAttributesSuccess':
            return {
                ...state,
                resourceCustomAttributes: a.payload ?? [],
                isFetchingResourceCustomAttributes: false,
            };
        case 'customAttributes/listResourceCustomAttributesFailure':
            return { ...state, isFetchingResourceCustomAttributes: false };
        case 'customAttributes/loadCustomAttributeContent':
            if (!a.payload) return state;
            const loadIdx = state.resourceCustomAttributesContents.findIndex(
                (c) => c.resource === a.payload.resource && c.resourceUuid === a.payload.resourceUuid,
            );
            if (loadIdx === -1) {
                return {
                    ...state,
                    resourceCustomAttributesContents: [...state.resourceCustomAttributesContents, a.payload],
                };
            }
            return {
                ...state,
                resourceCustomAttributesContents: state.resourceCustomAttributesContents.map((c, i) =>
                    i === loadIdx ? { ...c, customAttributes: a.payload.customAttributes } : c,
                ),
            };
        case 'customAttributes/updateCustomAttributeContent':
            return { ...state, isUpdatingContent: true };
        case 'customAttributes/updateCustomAttributeContentSuccess':
        case 'customAttributes/updateCustomAttributeContentFailure':
            return { ...state, isUpdatingContent: false };
        case 'customAttributes/removeCustomAttributeContent':
            return { ...state, isUpdatingContent: true };
        case 'customAttributes/removeCustomAttributeContentSuccess':
        case 'customAttributes/removeCustomAttributeContentFailure':
            return { ...state, isUpdatingContent: false };
        default:
            return state;
    }
}

export type ConnectorsTestState = {
    callbackData: { [key: string]: any };
    isRunningCallback: { [key: string]: boolean };
};

const connectorsTestInitialState: ConnectorsTestState = {
    callbackData: {},
    isRunningCallback: {},
};

function connectorsTestReducer(state: ConnectorsTestState = connectorsTestInitialState, action: UnknownAction): ConnectorsTestState {
    const a = action as { type: string; payload?: any };
    if (a.type === 'connectors/clearCallbackData') {
        return { ...state, callbackData: {} };
    }
    if (a.type === 'connectors/callbackSuccess' && a.payload) {
        return {
            ...state,
            callbackData: { ...state.callbackData, [a.payload.callbackId]: a.payload.data },
            isRunningCallback: { ...state.isRunningCallback, [a.payload.callbackId]: false },
        };
    }
    if (a.type === 'connectors/callbackFailure' && a.payload?.callbackId) {
        return {
            ...state,
            isRunningCallback: { ...state.isRunningCallback, [a.payload.callbackId]: false },
        };
    }
    if (a.type === 'connectors/callbackConnector' || a.type === 'connectors/callbackResource') {
        const callbackId = a.payload?.callbackId;
        if (callbackId) {
            return {
                ...state,
                callbackData: { ...state.callbackData, [callbackId]: undefined },
                isRunningCallback: { ...state.isRunningCallback, [callbackId]: true },
            };
        }
    }
    return state;
}

export const testReducers = combineReducers({
    userInterface: userInterfaceTestReducer,
    enums: enumsTestReducer,
    filters: filtersTestReducer,
    info: infoTestReducer,
    notifications: notificationsTestReducer,
    auth: authTestReducer,
    customAttributes: customAttributesTestReducer,
    connectors: connectorsTestReducer,
});

export const testInitialState = {
    userInterface: userInterfaceTestInitialState,
    enums: enumsTestInitialState,
    filters: filtersTestInitialState,
    info: infoTestInitialState,
    notifications: notificationsTestInitialState,
    auth: authTestInitialState,
    customAttributes: customAttributesTestInitialState,
    connectors: connectorsTestInitialState,
};

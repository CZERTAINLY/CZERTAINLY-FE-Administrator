import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CustomNode } from 'components/FlowChart';
import { Edge } from 'reactflow';
import { createSelector } from 'reselect';
import { AjaxError } from 'rxjs/ajax';
import { GlobalModalModel, LockWidgetNameEnum, ReactFlowUI, WidgetLockErrorModel, WidgetLockModel } from 'types/user-interface';
import { createFeatureSelector } from 'utils/ducks';
import { getLockWidgetObject } from 'utils/net';

export type State = {
    widgetLocks: WidgetLockModel[];
    globalModal: GlobalModalModel;
    initiateAttributeCallback?: boolean;
    attributeCallbackValue?: string;
    initiateFormCallback?: boolean;
    formCallbackValue?: string;
    reactFlowUI?: ReactFlowUI;
    theme: 'light' | 'dark';
};

export const initialState: State = {
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
    theme: (typeof window !== 'undefined' && window.localStorage ? (localStorage.getItem('theme') as 'light' | 'dark') : null) || 'light',
};

export const slice = createSlice({
    name: 'userInterface',

    initialState,

    reducers: {
        resetState: (state, action: PayloadAction<void>) => {
            Object.keys(state).forEach((key) => {
                if (!initialState.hasOwnProperty(key)) (state as any)[key] = undefined;
            });

            Object.keys(initialState).forEach((key) => ((state as any)[key] = (initialState as any)[key]));
        },

        insertWidgetLock: {
            prepare: (error: AjaxError | WidgetLockErrorModel, lockWidgetName: LockWidgetNameEnum) => {
                let payload;
                if (error instanceof AjaxError) {
                    const widgetLockObject = getLockWidgetObject(error);
                    payload = {
                        widgetName: lockWidgetName,
                        ...widgetLockObject,
                    };
                } else {
                    payload = {
                        widgetName: lockWidgetName,
                        ...error,
                    };
                }
                return { payload };
            },
            reducer: (state, action: PayloadAction<WidgetLockModel>) => {
                if (state.widgetLocks.some((lock) => lock.widgetName === action.payload.widgetName)) return;
                state.widgetLocks.push(action.payload);
            },
        },
        removeWidgetLock: (state, action: PayloadAction<LockWidgetNameEnum>) => {
            state.widgetLocks = state.widgetLocks.filter((widgetLock) => widgetLock.widgetName !== action.payload);
        },

        showGlobalModal: (state, action: PayloadAction<GlobalModalModel>) => {
            state.globalModal = action.payload;
        },

        hideGlobalModal: (state) => {
            state.globalModal = initialState.globalModal;
        },

        updateModalContent: (state, action: PayloadAction<string>) => {
            state.globalModal.content = action.payload;
        },

        setOkButtonCallback: (state, action: PayloadAction<() => void>) => {
            state.globalModal.okButtonCallback = action.payload;
        },

        setCancelButtonCallback: (state, action: PayloadAction<() => void>) => {
            state.globalModal.cancelButtonCallback = action.payload;
        },

        setInitiateAttributeCallback: (state, action: PayloadAction<boolean>) => {
            state.initiateAttributeCallback = action.payload;
        },

        setAttributeCallbackValue: (state, action: PayloadAction<string>) => {
            state.attributeCallbackValue = action.payload;
        },

        clearAttributeCallbackValue: (state) => {
            state.attributeCallbackValue = undefined;
        },

        setInitiateFormCallback: (state, action: PayloadAction<boolean>) => {
            state.initiateFormCallback = action.payload;
        },

        setFormCallbackValue: (state, action: PayloadAction<string>) => {
            state.formCallbackValue = action.payload;
        },

        clearFormCallbackValue: (state) => {
            state.formCallbackValue = undefined;
        },

        setReactFlowUI: (state, action: PayloadAction<ReactFlowUI>) => {
            state.reactFlowUI = action.payload;
        },

        clearReactFlowUI: (state) => {
            state.reactFlowUI = undefined;
        },

        updateReactFlowNodes: (state, action: PayloadAction<CustomNode[]>) => {
            if (state.reactFlowUI) {
                state.reactFlowUI.flowChartNodes = action.payload;
            }
        },

        updateReactFlowEdges: (state, action: PayloadAction<Edge[]>) => {
            if (state.reactFlowUI) {
                state.reactFlowUI.flowChartEdges = action.payload;
            }
        },

        deleteNode: (state, action: PayloadAction<string>) => {
            if (state.reactFlowUI) {
                state.reactFlowUI.flowChartNodes = state.reactFlowUI.flowChartNodes.filter((node) => node.id !== action.payload);
            }
        },
        setShowHiddenNodes: (state, action: PayloadAction<string | undefined>) => {
            if (state.reactFlowUI) {
                state.reactFlowUI.expandedHiddenNodeId = action.payload;
            }
        },

        insertReactFlowFormNode: (state, action: PayloadAction<CustomNode>) => {
            const noPresentFormNode = state.reactFlowUI?.flowChartNodes?.some((node) => node.id === 'ReactFlowFormNode');
            if (action.payload.id === 'ReactFlowFormNode' && !noPresentFormNode) {
                state.reactFlowUI?.flowChartNodes.push(action.payload);
            }
        },

        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
            if (action.payload === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },

        toggleTheme: (state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            state.theme = newTheme;
            localStorage.setItem('theme', newTheme);
            if (newTheme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        },
    },
});

const selectState = createFeatureSelector<State>(slice.name);

const selectWidgetLocks = createSelector(selectState, (state) => state.widgetLocks);
const selectGlobalModal = createSelector(selectState, (state) => state.globalModal);
const selectInitiateAttributeCallback = createSelector(selectState, (state) => state.initiateAttributeCallback);
const selectAttributeCallbackValue = createSelector(selectState, (state) => state.attributeCallbackValue);
const selectCallbackValue = createSelector(selectState, (state) => state.formCallbackValue);
const selectInitiateFormCallback = createSelector(selectState, (state) => state.initiateFormCallback);
const reactFlowUI = createSelector(selectState, (state) => state.reactFlowUI);
const flowChartNodes = createSelector(reactFlowUI, (state) => state?.flowChartNodes);
const flowChartEdges = createSelector(reactFlowUI, (state) => state?.flowChartEdges);
const expandedHiddenNodeId = createSelector(reactFlowUI, (state) => state?.expandedHiddenNodeId);
const selectTheme = createSelector(selectState, (state) => state.theme);

export const selectors = {
    selectState,
    selectWidgetLocks,
    selectGlobalModal,
    selectInitiateAttributeCallback,
    selectAttributeCallbackValue,
    selectCallbackValue,
    selectInitiateFormCallback,
    reactFlowUI,
    flowChartNodes,
    flowChartEdges,
    expandedHiddenNodeId,
    selectTheme,
};

export const actions = slice.actions;

export default slice.reducer;

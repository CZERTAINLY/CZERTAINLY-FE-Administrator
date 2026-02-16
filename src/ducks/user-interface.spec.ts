import { test, expect } from '../../playwright/ct-test';
import reducer, { actions, initialState } from './user-interface';
import { LockWidgetNameEnum, LockTypeEnum } from 'types/user-interface';

test.describe('user-interface slice', () => {
    test('initial state', () => {
        expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    test('insertWidgetLock adds lock when not present', () => {
        const errorPayload = { lockTitle: 'Locked', lockText: 'Message', lockType: LockTypeEnum.GENERIC };
        const next = reducer(initialState, actions.insertWidgetLock(errorPayload as any, LockWidgetNameEnum.ListOfCertificates));
        expect(next.widgetLocks).toHaveLength(1);
        expect(next.widgetLocks[0].widgetName).toBe(LockWidgetNameEnum.ListOfCertificates);
        expect(next.widgetLocks[0].lockTitle).toBe('Locked');
    });

    test('insertWidgetLock does not duplicate same widgetName', () => {
        const stateWithLock = {
            ...initialState,
            widgetLocks: [
                { widgetName: LockWidgetNameEnum.ListOfCertificates, lockTitle: 'A', lockText: 'T', lockType: LockTypeEnum.GENERIC },
            ],
        };
        const errorPayload = { lockTitle: 'B', lockText: 'T2', lockType: LockTypeEnum.GENERIC };
        const next = reducer(stateWithLock, actions.insertWidgetLock(errorPayload as any, LockWidgetNameEnum.ListOfCertificates));
        expect(next.widgetLocks).toHaveLength(1);
    });

    test('removeWidgetLock removes lock by name', () => {
        const stateWithLock = {
            ...initialState,
            widgetLocks: [
                {
                    widgetName: LockWidgetNameEnum.ListOfCertificates,
                    lockTitle: 'Locked',
                    lockText: 'Text',
                    lockType: LockTypeEnum.GENERIC,
                },
            ],
        };
        const next = reducer(stateWithLock, actions.removeWidgetLock(LockWidgetNameEnum.ListOfCertificates));
        expect(next.widgetLocks).toHaveLength(0);
    });

    test('removeWidgetLock leaves other locks', () => {
        const stateWithLocks = {
            ...initialState,
            widgetLocks: [
                { widgetName: LockWidgetNameEnum.ListOfCertificates, lockTitle: 'A', lockText: 'T', lockType: LockTypeEnum.GENERIC },
                { widgetName: LockWidgetNameEnum.ListOfRAProfiles, lockTitle: 'B', lockText: 'T', lockType: LockTypeEnum.GENERIC },
            ],
        };
        const next = reducer(stateWithLocks, actions.removeWidgetLock(LockWidgetNameEnum.ListOfCertificates));
        expect(next.widgetLocks).toHaveLength(1);
        expect(next.widgetLocks[0].widgetName).toBe(LockWidgetNameEnum.ListOfRAProfiles);
    });

    test('showGlobalModal updates globalModal', () => {
        const payload = {
            title: 'Title',
            size: 'md' as const,
            content: 'Content',
            isOpen: true,
            showCancelButton: true,
            showOkButton: false,
            showCloseButton: false,
            showSubmitButton: false,
            okButtonCallback: undefined,
            cancelButtonCallback: undefined,
        };
        const next = reducer(initialState, actions.showGlobalModal(payload));
        expect(next.globalModal).toEqual(payload);
        expect(next.globalModal?.isOpen).toBe(true);
    });

    test('hideGlobalModal resets globalModal to initial', () => {
        const stateWithModal = {
            ...initialState,
            globalModal: {
                ...initialState.globalModal,
                isOpen: true,
                title: 'Open',
            },
        };
        const next = reducer(stateWithModal, actions.hideGlobalModal());
        expect(next.globalModal).toEqual(initialState.globalModal);
    });

    test('setAttributeCallbackValue and clearAttributeCallbackValue', () => {
        let next = reducer(initialState, actions.setAttributeCallbackValue('value'));
        expect(next.attributeCallbackValue).toBe('value');
        next = reducer(next, actions.clearAttributeCallbackValue());
        expect(next.attributeCallbackValue).toBeUndefined();
    });

    test('setReactFlowUI and clearReactFlowUI', () => {
        const flowUI = { flowChartNodes: [], flowChartEdges: [], flowDirection: 'TB' as const };
        let next = reducer(initialState, actions.setReactFlowUI(flowUI));
        expect(next.reactFlowUI).toEqual(flowUI);
        next = reducer(next, actions.clearReactFlowUI());
        expect(next.reactFlowUI).toBeUndefined();
    });

    test('resetState restores initial state', () => {
        const modified = {
            ...initialState,
            attributeCallbackValue: 'x',
        };
        const next = reducer(modified, actions.resetState());
        expect(next.attributeCallbackValue).toBeUndefined();
    });
});

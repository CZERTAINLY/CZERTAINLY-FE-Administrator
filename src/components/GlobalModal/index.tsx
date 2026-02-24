import Dialog, { DialogButton } from 'components/Dialog';
import { actions, selectors } from 'ducks/user-interface';
import type { GlobalModalModel } from 'types/user-interface';
import type { Dispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

export function getGlobalModalDialogProps(globalModal: GlobalModalModel, dispatch: Dispatch): Parameters<typeof Dialog>[0] {
    const {
        isOpen,
        size,
        title,
        content,
        showCancelButton,
        showOkButton,
        showSubmitButton,
        showCloseButton,
        okButtonCallback,
        cancelButtonCallback,
        icon,
    } = globalModal;

    const buttons = [] as DialogButton[];
    if (showOkButton) {
        buttons.push({
            color: 'primary',
            onClick: () => (okButtonCallback ? okButtonCallback() : dispatch(actions.resetState())),
            body: 'OK',
        });
    }
    if (showCancelButton) {
        buttons.push({
            color: 'secondary',
            body: 'Cancel',
            onClick: () => {
                cancelButtonCallback ? cancelButtonCallback() : dispatch(actions.resetState());
            },
        });
    }

    if (showSubmitButton) {
        buttons.push({
            color: 'primary',
            onClick: () => (okButtonCallback ? okButtonCallback() : dispatch(actions.resetState())),
            body: 'Submit',
        });
    }
    if (showCloseButton) {
        buttons.push({
            color: 'secondary',
            variant: 'outline',
            onClick: () => {
                if (cancelButtonCallback) {
                    cancelButtonCallback();
                } else {
                    dispatch(actions.resetState());
                }
            },
            body: 'Close',
        });
    }

    return {
        dataTestId: 'global-modal',
        isOpen,
        toggle: () => {
            if (cancelButtonCallback) {
                cancelButtonCallback();
            } else {
                dispatch(actions.resetState());
            }
        },
        size: size || undefined,
        buttons,
        caption: title,
        body: content,
        icon,
    };
}

export default function GlobalModal() {
    const globalModal = useSelector(selectors.selectGlobalModal);
    const dispatch = useDispatch();
    return <Dialog {...getGlobalModalDialogProps(globalModal, dispatch)} />;
}

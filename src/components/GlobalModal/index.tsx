import Dialog, { DialogButton } from 'components/Dialog';
import { actions, selectors } from 'ducks/user-interface';
import { useDispatch, useSelector } from 'react-redux';

export default function GlobalModal() {
    const globalModal = useSelector(selectors.selectGlobalModal);

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
    const dispatch = useDispatch();

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
            onClick: () => dispatch(actions.resetState()),
            body: 'Close',
        });
    }

    return (
        <Dialog
            isOpen={isOpen}
            toggle={() => dispatch(actions.resetState())}
            size={size || undefined}
            buttons={buttons}
            caption={title}
            body={content}
            icon={icon}
        />
    );
}

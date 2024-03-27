import { actions, selectors } from 'ducks/user-interface';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

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
    } = globalModal;
    const dispatch = useDispatch();

    return (
        <Modal size={size || undefined} isOpen={isOpen} toggle={() => {}}>
            <ModalHeader
                toggle={() => {
                    dispatch(actions.resetState());
                }}
            >
                {title}
            </ModalHeader>

            <ModalBody>{content}</ModalBody>

            <ModalFooter>
                {showOkButton && (
                    <Button color="primary" onClick={() => (okButtonCallback ? okButtonCallback() : dispatch(actions.resetState()))}>
                        Ok
                    </Button>
                )}
                {showCancelButton && (
                    <Button
                        color="secondary"
                        onClick={() => {
                            cancelButtonCallback ? cancelButtonCallback() : dispatch(actions.resetState());
                        }}
                    >
                        Cancel
                    </Button>
                )}
                {showSubmitButton && (
                    <Button color="primary" onClick={() => (okButtonCallback ? okButtonCallback() : dispatch(actions.resetState()))}>
                        Submit
                    </Button>
                )}

                {showCloseButton && (
                    <Button
                        color="secondary"
                        onClick={() => {
                            dispatch(actions.resetState());
                        }}
                    >
                        Close
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
}

import { actions, selectors } from "ducks/user-interface";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

interface DialogButton {
    color: string;
    body: string | JSX.Element;
    onClick: (formData?: any) => void;
    disabled?: boolean;
}

interface Props {
    isOpen: boolean;
    toggle?: () => void;
    caption?: string | JSX.Element;
    body?: string | JSX.Element;
    buttons?: DialogButton[];
    size?: "sm" | "lg" | "xl";
}

export default function GlobalModal() {
    const globalModal = useSelector(selectors.selectGlobalModal);
    const { isOpen, size, title, content, showCancelButton, showOkButton, okButtonCallback, cancelButtonCallback } = globalModal;
    const dispatch = useDispatch();

    return (
        <Modal size={size || undefined} isOpen={isOpen} toggle={() => {}}>
            <ModalHeader
                toggle={() => {
                    dispatch(actions.hideGlobalModal());
                }}
            >
                {title}
            </ModalHeader>

            <ModalBody>{content}</ModalBody>

            <ModalFooter>
                {showOkButton && (
                    <Button color="primary" onClick={() => (okButtonCallback ? okButtonCallback() : dispatch(actions.hideGlobalModal()))}>
                        Ok
                    </Button>
                )}
                {showCancelButton && (
                    <Button
                        color="secondary"
                        onClick={() => {
                            cancelButtonCallback ? cancelButtonCallback() : dispatch(actions.hideGlobalModal());
                        }}
                    >
                        Cancel
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
}

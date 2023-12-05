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
    const dispatch = useDispatch();

    return (
        <Modal size={globalModal.size || undefined} isOpen={globalModal.isOpen} toggle={() => {}}>
            <ModalHeader
                toggle={() => {
                    dispatch(actions.hideGlobalModal());
                }}
            >
                {globalModal.title}
            </ModalHeader>

            <ModalBody>{globalModal.content}</ModalBody>

            <ModalFooter>
                {globalModal.showOkButton && (
                    <Button
                        color="primary"
                        onClick={() =>
                            globalModal?.okButtonCallback ? globalModal.okButtonCallback() : dispatch(actions.hideGlobalModal())
                        }
                    >
                        Ok
                    </Button>
                )}
                {globalModal.showCancelButton && (
                    <Button
                        color="secondary"
                        onClick={() => {
                            dispatch(actions.hideGlobalModal());
                        }}
                    >
                        Cancel
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
}

import { actions, selectors } from "ducks/user-interface";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

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

            <ModalFooter></ModalFooter>
        </Modal>
    );
}

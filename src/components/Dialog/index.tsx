import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import styles from './Dialog.module.scss';

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
    size?: 'sm' | 'lg' | 'xl';
    dataTestId?: string;
}

export default function Dialog(props: Props) {
    return (
        <Modal
            size={props.size || undefined}
            isOpen={props.isOpen}
            toggle={() => {
                if (props.toggle) props.toggle();
            }}
            data-testid={props.dataTestId}
        >
            <ModalHeader
                toggle={() => {
                    if (props.toggle) props.toggle();
                }}
            >
                {props.caption}
            </ModalHeader>

            <ModalBody>{props.body}</ModalBody>

            <ModalFooter>
                {!props.buttons ? (
                    <></>
                ) : (
                    props.buttons.map((button, index) => (
                        <Button
                            key={index}
                            color={button.color}
                            onClick={() => button.onClick()}
                            disabled={button.disabled || false}
                            className={styles.dialogButton}
                        >
                            {button.body}
                        </Button>
                    ))
                )}
            </ModalFooter>
        </Modal>
    );
}

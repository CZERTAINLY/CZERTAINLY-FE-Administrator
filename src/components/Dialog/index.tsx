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
   size?: "sm" | "lg";
}


export default function Dialog(props: Props) {

   return (

      <Modal size={props.size || undefined} isOpen={props.isOpen} toggle={() => { if (props.toggle) props.toggle() }}>

         <ModalHeader toggle={() => { if (props.toggle) props.toggle() }}>
            {props.caption}
         </ModalHeader>

         <ModalBody>
            {props.body}
         </ModalBody>

         <ModalFooter>

            {!props.buttons ? <></> : props.buttons.map(

               (button, index) => (
                  <Button key={index} color={button.color} onClick={() => button.onClick()} disabled={button.disabled || false}>
                     {button.body}
                  </Button>
               )

            )}

         </ModalFooter>

      </Modal>

   )


}
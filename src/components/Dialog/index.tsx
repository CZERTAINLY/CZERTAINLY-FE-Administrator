import { MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from "mdbreact";
import { Button } from "reactstrap";

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
}


export default function Dialog(props: Props) {

   return (

      <MDBModal overflowScroll={false} isOpen={props.isOpen} toggle={() => { if (props.toggle) props.toggle() }}>

         <MDBModalHeader toggle={() => { if (props.toggle) props.toggle() }}>
            {props.caption}
         </MDBModalHeader>

         <MDBModalBody>
            {props.body}
         </MDBModalBody>

         <MDBModalFooter>

            {!props.buttons ? <></> : props.buttons.map(

               (button, index) => (
                  <Button key={index} color={button.color} onClick={() => button.onClick()} disabled={button.disabled || false}>
                     {button.body}
                  </Button>
               )

            )}

         </MDBModalFooter>

      </MDBModal>

   )


}
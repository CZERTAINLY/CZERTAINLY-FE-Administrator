import { MDBModal, MDBModalBody, MDBModalFooter, MDBModalHeader } from "mdbreact";
import { useCallback, useRef } from "react";
import { Button } from "reactstrap";

interface DialogButton {

   color: string;
   body: string | JSX.Element;
   onClick: (formData?: any) => void;

}


interface Props {
   isOpen: boolean;
   toggle?: () => void;
   caption?: string | JSX.Element;
   body?: string | JSX.Element;
   buttons?: DialogButton[];
}


export default function Dialog(props: Props) {

   const ref = useRef<HTMLDivElement>(null);

   const collectBodyData = useCallback(

      (buttonCb: (formData?: { [key: string]: any }) => void) => {

         const formData: { [key: string]: any } = {};

         const inputs = ref.current!.querySelectorAll<HTMLInputElement>("input") ;
         const textareas = ref.current!.querySelectorAll<HTMLInputElement>("textarea") ;

         for (let i = 0; i < inputs.length; i++) {
            const name = inputs[i].name || inputs[i].id;
            if (inputs[i].type !== "button") formData[name] = inputs[i].value;
         }

         for (let i = 0; i < textareas.length; i++) {
            const name = textareas[i].name || textareas[i].id;
            formData[name] = textareas[i].value;
         }

         buttonCb(formData);

      },
      []
   );

   return (

      <MDBModal overflowScroll={false} isOpen={props.isOpen} toggle={() => { if (props.toggle) props.toggle() }}>

         <MDBModalHeader toggle={() => { if (props.toggle) props.toggle() }}>
            {props.caption}
         </MDBModalHeader>

         <MDBModalBody>
            <div ref={ref}>{props.body}</div>
         </MDBModalBody>

         <MDBModalFooter>

            {!props.buttons ? <></> : props.buttons.map(

               (button, index) => (
                  <Button key={index} color={button.color} onClick={() => collectBodyData(button.onClick)}>
                     {button.body}
                  </Button>
               )

            )}

         </MDBModalFooter>

      </MDBModal>

   )


}
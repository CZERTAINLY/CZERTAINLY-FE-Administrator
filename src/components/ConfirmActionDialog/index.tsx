import {
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";
import React from "react";

import { Button } from "reactstrap";

interface Props {
  isOpen: boolean;
  title?: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmEditDialog({
  isOpen,
  text,
  title,
  confirmText,
  cancelText,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <MDBModal isOpen={isOpen} toggle={onCancel} overflowScroll={false}>
      <MDBModalHeader toggle={onCancel}>
        {title || "Confirm Action"}
      </MDBModalHeader>
      <MDBModalBody>
        {text || "Are you sure you want to continue?"}
      </MDBModalBody>
      <MDBModalFooter>
        <Button color="success" onClick={onConfirm}>
          {confirmText || "Yes"}
        </Button>
        <Button color="secondary" onClick={onCancel}>
          {cancelText || "Cancel"}
        </Button>
      </MDBModalFooter>
    </MDBModal>
  );
}

export default ConfirmEditDialog;

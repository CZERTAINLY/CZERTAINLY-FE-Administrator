import React from "react";
import { Button, Spinner } from "reactstrap";

interface Props {
  disabled?: boolean;
  inProgress: boolean;
  title: string;
  inProgressTitle?: string;
  color?: string;
  onClick?: () => void;
}

function ProgressButton({
  inProgress,
  title,
  inProgressTitle = title,
  disabled = false,
  color = "primary",
  onClick
}: Props) {
  return (
    <Button color={color} type="submit" disabled={disabled || inProgress} onClick={onClick}>
      {inProgress ? (
        <div>
          <Spinner color="light" size="sm" />
          <span>&nbsp;{inProgressTitle}</span>
        </div>
      ) : (
        title
      )}
    </Button>
  );
}

export default ProgressButton;
